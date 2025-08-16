"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function Home() {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  if (session) {
    return(
      <div className="flex flex-col gap-y-4">
        <p>Signed in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    )
  }

  const onSubmit = () => {
    authClient.signUp.email({
      name,
      email,
      password
    },{
      onError:()=>{
        window.alert("Error creating user");
      },
      onSuccess:()=>{
        window.alert("User created successfully");
      } 
    })
  }

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password
    },{
      onError:()=>{
        window.alert("Error signing in");
      },
      onSuccess:()=>{
        window.alert("User signed in successfully");
      } 
    })
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-4 flex flex-col gap-y-4">
      <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)}></Input>
      <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
      <Button onClick={onSubmit}> Create User</Button>
    </div>
    <div className="p-4 flex flex-col gap-y-4">
      <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
      <Button onClick={onLogin}> Sign In</Button>
    </div>
    </div>
    
  );
}