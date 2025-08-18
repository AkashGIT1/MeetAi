/* eslint-disable @next/next/no-img-element */
"use client"
import { FaGithub, FaGoogle } from "react-icons/fa";

import { zodResolver } from '@hookform/resolvers/zod';
import { OctagonAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import{authClient} from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long and is required'),
});

export const SignInView = () => {

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false); 


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signIn.email({
      email: data.email,
      password: data.password,
    },{
      onSuccess: () => {
        setPending(false);
        router.push('/');
      },
      onError: ({error}) => {
        setPending(false);
        setError(error.message);
      },
    });
  };
   const onSocial = async (provider: 'google' | 'github') => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
      provider: provider,
      callbackURL: "/",
    },{
      onSuccess: () => {
        setPending(false);
      },
      onError: ({error}) => {
        setPending(false);
        setError(error.message);
      },
    });
  };

  return (
    <div className='flex flex-col gap-6'>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
              <div className ="flex flex-col gap-6">
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-bold'>
                    Welcome back to Milan.AI
                  </h1>
                  <p className='text-muted-foreground text-balance'>
                    Login to your account
                  </p>

                </div>
                <div className='grid gap-3'>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                          type='email' placeholder='yourmail@example.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type='password' placeholder='********' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert className='bg-destructive/10 border-none'>
                    <OctagonAlertIcon className='h-4 w-4 !text-destructive' />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button className='w-full' type='submit' disabled={pending}>
                  Sign In
                </Button>
                <div className='after:border-border relative text-center text-sm after:absolute after:insert-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                  <span className='bg-card text-muted-foreground relative z-10 px-2'>
                    or continue with
                  </span>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='outline' className='w-full' disabled={pending}
                  onClick={
                    ()=>onSocial('google')
                   }>
                    <FaGoogle />
                  </Button>
                  <Button
                   variant='outline' 
                   className='w-full' 
                   disabled={pending}
                   onClick={
                    ()=>onSocial('github')
                   }
                   >
                    <FaGithub />
                  </Button>
                </div>
                <div className='text-center text-sm'>
                  Don&apos;t have an account?{' '}
                  <Link href='/sign-up' className='text-blue-800 underline underline-offset-4'>
                    Sign Up
                  </Link>
                </div>

              </div>
            </form>
          </Form>
          


          <div className="bg-radial from-[rgb(38,100,223)] to-[rgb(13,62,158)] relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="logo"  className='h-[92px] w-[92px]'/>
            <p className='text-2xl font-semibold text-white'>
              Milan.AI
            </p>
          </div>
        </CardContent>
      
      </Card>
      <div className='text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a}:underline-offset-4'> By clicking Continue, you agree to our <Link href='/terms' className='text-blue-800 underline underline-offset-4'>Terms of Service</Link> and <Link href='/privacy' className='text-blue-800 underline underline-offset-4'>Privacy Policy</Link>.</div>
    </div>
  );

};
