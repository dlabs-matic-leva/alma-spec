import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {redirect} from "next/navigation";

export default function LoginForm() {
    async function login() {

        'use server'
        redirect(`/app/clients`)
    }
    return (

        <main className="flex h-lvh justify-center items-center">
            <Card className="w-full max-w-sm">
                <form action={login}>
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Jamboo Back Office</CardTitle>
                    <CardDescription>
                        Enter your credentials below to enter the Jamboo back office
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Username</Label>
                        <Input id="email" type="text"/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password"/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
                        Sign in
                    </Button>
                </CardFooter>
                </form>
            </Card>
        </main>
    )
}
