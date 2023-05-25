import { useState, useEffect } from "react";
import PrimaryButton from "../components/primary-button";
import abi from '../utils/Keyboards.json';
import {ethers} from 'ethers'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRouter } from 'next/router';

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);

  const route = useRouter()
  
  const [keyboards, setKeyboards] = useState([])
    let [formData, setFormData]= useState({
    keyboardKind:'',
    isPBT:'',
    filter:''
  })

    let {keyboardKind, isPBT, filter} = formData

  const keyboardsContractAddress = process.env.keyboardsContractAddress
  const keyboardContractABI = abi.abi

  const handleAccounts = (accounts) => {
  if (accounts.length > 0) {
    const account = accounts[0];
    console.log('We have an authorized account: ', account);
    setConnectedAccount(account);
  } else {
    console.log("No authorized accounts yet")
  }
};

const getConnectedAccount = async () => {
  if (window.ethereum) {
    setEthereum(window.ethereum);
  }

  if (ethereum) {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    handleAccounts(accounts);
  }
};
useEffect(() => getConnectedAccount(), []);


const getKeyboards = async () => {
    if (ethereum && connectedAccount) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const keyboardsContract = new ethers.Contract(keyboardsContractAddress, keyboardContractABI, signer);

      const keyboards = await keyboardsContract.getKeyboards();
      console.log('Retrieved keyboards...', keyboards)
      setKeyboards(keyboards)
    }
  }
  useEffect(() => getKeyboards(), [connectedAccount])


  const connectAccount = async () => {
     if (!ethereum) {
    alert('MetaMask is required to connect an account');
    return;
  }

  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  handleAccounts(accounts);
  };

  if (!ethereum) {
    return <p>Please install MetaMask to connect to this site</p>
  }

  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>
  }




 const handleSubmit = async (e)=>{
  e.preventDefault()
  console.log(formData)
  

   if (!ethereum) {
      console.error('Ethereum object is required to create a keyboard');
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const keyboardsContract = new ethers.Contract(keyboardsContractAddress, keyboardContractABI, signer);

    const createTxn = await keyboardsContract.create(keyboardKind, isPBT, filter);
    console.log('Create transaction started...', createTxn.hash);

    await createTxn.wait();
    console.log('Created keyboard!', createTxn.hash);

    await getKeyboards();
   // route.push('')
   setFormData({
    keyboardKind:'',
    isPBT:'',
    filter:''
  })

 }



  return (
    <Form onSubmit={handleSubmit}>
      <div>{keyboards.map((keyboard, i) => <p key={i}>{keyboard.kind}, {keyboard.isPBT}</p>)}</div>
    <Form.Group className="mb-3" controlId="formBasicEmail">
     <Form.Select aria-label="Default select example" value={keyboardKind} onChange={(e)=>setFormData({...formData, keyboardKind: e.target.value})} >
            <option value="">Choose Keyboard Kind</option>
            <option value="0">60%</option>
            <option value="1">75%</option>
            <option value="2">80%</option>
            <option value="3">ISO-105</option>
    </Form.Select>
    </Form.Group>
    


    <Form.Group className="mb-3" controlId="formBasicEmail">
     <Form.Select aria-label="Default select example" value={isPBT} onChange={(e)=>setFormData({...formData, isPBT: e.target.value})} >
            <option value="">ABS or PBT</option>  
            <option value="abs">ABS</option>
            <option value="pbt">PBT</option>
    </Form.Select>
    </Form.Group>

     <Form.Group className="mb-3" controlId="formBasicEmail">
     <Form.Select aria-label="Default select example" value={filter} onChange={(e)=>setFormData({...formData, filter: e.target.value})} >
            <option value="">None</option>
            <option value="sepia">Sepia</option>
            <option value="grayscale">Grayscale</option>
            <option value="invert">Invert</option>
            <option value="hue-rotate-90">Hue Rotate (90°)</option>
            <option value="hue-rotate-180">Hue Rotate (180°)</option>
    </Form.Select>
    </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )
}