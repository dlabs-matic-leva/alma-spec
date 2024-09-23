"use client"

import Image from "next/image"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {useState} from "react";

const _clients = [
        {
            fullName: 'Fiona Smith',
            accountBalance: '294.64',
            status: 'active'
        },
        {
            fullName: 'Jane Davis',
            accountBalance: '832.71',
            status: 'active'
        },
        {
            fullName: 'David Jones',
            accountBalance: '319.84',
            status: 'active'
        },
        {
            fullName: 'Charlie Garcia',
            accountBalance: '979.12',
            status: 'pending'
        },
        {
            fullName: 'George Williams',
            accountBalance: '885.98',
            status: 'active'
        },
        {
            fullName: 'Charlie Wilson',
            accountBalance: '427.52',
            status: 'active'
        },
        {
            fullName: 'Hannah Miller',
            accountBalance: '502.52',
            status: 'pending'
        },
        {
            fullName: 'David Brown',
            accountBalance: '682.07',
            status: 'pending'
        },
        {
            fullName: 'Jane Smith',
            accountBalance: '910.61',
            status: 'active'
        },
        {
            fullName: 'Fiona Garcia',
            accountBalance: '572.36',
            status: 'active'
        },
        {
            fullName: 'Alice Davis',
            accountBalance: '908.65',
            status: 'active'
        },
        {
            fullName: 'Fiona Williams',
            accountBalance: '271.76',
            status: 'pending'
        },
        {
            fullName: 'Alice Garcia',
            accountBalance: '524.30',
            status: 'pending'
        },
        {
            fullName: 'John Garcia',
            accountBalance: '818.88',
            status: 'active'
        },
        {
            fullName: 'Hannah Davis',
            accountBalance: '387.37',
            status: 'pending'
        },
        {
            fullName: 'Emily Johnson',
            accountBalance: '55.36',
            status: 'active'
        },
        {
            fullName: 'Emily Jones',
            accountBalance: '922.65',
            status: 'active'
        },
        {
            fullName: 'David Taylor',
            accountBalance: '612.59',
            status: 'active'
        },
        {
            fullName: 'George Wilson',
            accountBalance: '816.50',
            status: 'active'
        },
        {
            fullName: 'David Davis',
            accountBalance: '138.74',
            status: 'active'
        },
        {
            fullName: 'Emily Garcia',
            accountBalance: '898.34',
            status: 'active'
        },
        {
            fullName: 'Fiona Johnson',
            accountBalance: '120.37',
            status: 'active'
        },
        {
            fullName: 'John Jones',
            accountBalance: '239.87',
            status: 'pending'
        },
        {
            fullName: 'Charlie Johnson',
            accountBalance: '51.41',
            status: 'active'
        },
        {
            fullName: 'Fiona Smith',
            accountBalance: '888.09',
            status: 'active'
        },
        {
            fullName: 'John Johnson',
            accountBalance: '577.89',
            status: 'active'
        },
        {
            fullName: 'Hannah Miller',
            accountBalance: '750.22',
            status: 'active'
        },
        {
            fullName: 'Fiona Jones',
            accountBalance: '644.03',
            status: 'active'
        },
        {
            fullName: 'George Johnson',
            accountBalance: '106.57',
            status: 'pending'
        },
        {
            fullName: 'David Jones',
            accountBalance: '124.01',
            status: 'active'
        },
        {
            fullName: 'Hannah Garcia',
            accountBalance: '431.76',
            status: 'active'
        },
        { fullName: 'Bob Davis', accountBalance: '655.16', status: 'active' },
        {
            fullName: 'George Jones',
            accountBalance: '553.05',
            status: 'pending'
        },
        {
            fullName: 'George Miller',
            accountBalance: '308.70',
            status: 'active'
        },
        {
            fullName: 'Alice Davis',
            accountBalance: '792.51',
            status: 'active'
        },
        {
            fullName: 'Hannah Johnson',
            accountBalance: '621.49',
            status: 'active'
        },
        {
            fullName: 'Charlie Williams',
            accountBalance: '827.87',
            status: 'active'
        },
        {
            fullName: 'Alice Brown',
            accountBalance: '939.76',
            status: 'active'
        },
        {
            fullName: 'Alice Taylor',
            accountBalance: '544.28',
            status: 'active'
        },
        {
            fullName: 'Charlie Wilson',
            accountBalance: '473.25',
            status: 'active'
        },
        {
            fullName: 'Fiona Brown',
            accountBalance: '325.47',
            status: 'pending'
        },
        {
            fullName: 'Fiona Taylor',
            accountBalance: '114.23',
            status: 'active'
        },
        {
            fullName: 'Hannah Miller',
            accountBalance: '112.65',
            status: 'active'
        },
        {
            fullName: 'Alice Garcia',
            accountBalance: '778.40',
            status: 'pending'
        },
        {
            fullName: 'Alice Davis',
            accountBalance: '16.17',
            status: 'active'
        },
        {
            fullName: 'Fiona Miller',
            accountBalance: '406.21',
            status: 'active'
        },
        {
            fullName: 'Hannah Wilson',
            accountBalance: '245.66',
            status: 'active'
        },
        {
            fullName: 'Alice Brown',
            accountBalance: '804.24',
            status: 'active'
        },
        {
            fullName: 'Emily Brown',
            accountBalance: '55.05',
            status: 'active'
        },
        {
            fullName: 'John Brown',
            accountBalance: '120.17',
            status: 'active'
        },
        {
            fullName: 'Charlie Garcia',
            accountBalance: '430.52',
            status: 'active'
        },
        {
            fullName: 'Alice Jones',
            accountBalance: '948.50',
            status: 'active'
        },
        {
            fullName: 'Charlie Wilson',
            accountBalance: '500.24',
            status: 'active'
        },
        {
            fullName: 'Jane Davis',
            accountBalance: '172.91',
            status: 'active'
        },
        {
            fullName: 'Hannah Garcia',
            accountBalance: '547.89',
            status: 'active'
        },
        {
            fullName: 'David Johnson',
            accountBalance: '986.96',
            status: 'active'
        },
        {
            fullName: 'Jane Garcia',
            accountBalance: '735.60',
            status: 'active'
        },
        {
            fullName: 'John Brown',
            accountBalance: '106.41',
            status: 'active'
        },
        {
            fullName: 'Alice Miller',
            accountBalance: '999.63',
            status: 'active'
        },
        {
            fullName: 'Fiona Jones',
            accountBalance: '79.55',
            status: 'active'
        },
        {
            fullName: 'Hannah Jones',
            accountBalance: '258.60',
            status: 'active'
        },
        {
            fullName: 'Hannah Williams',
            accountBalance: '792.98',
            status: 'active'
        },
        {
            fullName: 'Fiona Garcia',
            accountBalance: '893.74',
            status: 'active'
        },
        {
            fullName: 'Alice Wilson',
            accountBalance: '18.49',
            status: 'active'
        },
        {
            fullName: 'David Miller',
            accountBalance: '328.24',
            status: 'pending'
        },
        {
            fullName: 'George Davis',
            accountBalance: '475.55',
            status: 'active'
        },
        {
            fullName: 'George Miller',
            accountBalance: '717.25',
            status: 'active'
        },
        {
            fullName: 'Charlie Smith',
            accountBalance: '874.80',
            status: 'active'
        },
        {
            fullName: 'George Taylor',
            accountBalance: '317.97',
            status: 'active'
        },
        {
            fullName: 'John Miller',
            accountBalance: '247.72',
            status: 'pending'
        },
        {
            fullName: 'Jane Brown',
            accountBalance: '220.54',
            status: 'active'
        },
        {
            fullName: 'Hannah Taylor',
            accountBalance: '518.90',
            status: 'active'
        },
        {
            fullName: 'David Brown',
            accountBalance: '723.71',
            status: 'pending'
        },
        {
            fullName: 'Fiona Williams',
            accountBalance: '519.23',
            status: 'active'
        },
        {
            fullName: 'Charlie Johnson',
            accountBalance: '636.19',
            status: 'active'
        },
        {
            fullName: 'John Smith',
            accountBalance: '593.55',
            status: 'active'
        },
        {
            fullName: 'Charlie Smith',
            accountBalance: '685.51',
            status: 'active'
        },
        {
            fullName: 'Alice Johnson',
            accountBalance: '518.48',
            status: 'active'
        },
        {
            fullName: 'Emily Johnson',
            accountBalance: '500.26',
            status: 'pending'
        },
        {
            fullName: 'Charlie Wilson',
            accountBalance: '200.01',
            status: 'active'
        },
        {
            fullName: 'John Miller',
            accountBalance: '628.70',
            status: 'pending'
        },
        {
            fullName: 'Fiona Smith',
            accountBalance: '840.10',
            status: 'active'
        },
        {
            fullName: 'David Johnson',
            accountBalance: '995.65',
            status: 'active'
        },
        {
            fullName: 'Hannah Wilson',
            accountBalance: '298.39',
            status: 'active'
        },
        {
            fullName: 'Hannah Taylor',
            accountBalance: '545.10',
            status: 'active'
        },
        {
            fullName: 'David Jones',
            accountBalance: '319.35',
            status: 'active'
        },
        {
            fullName: 'Fiona Smith',
            accountBalance: '622.15',
            status: 'active'
        },
        {
            fullName: 'George Smith',
            accountBalance: '780.49',
            status: 'active'
        },
        {
            fullName: 'Hannah Miller',
            accountBalance: '346.29',
            status: 'pending'
        },
        {
            fullName: 'Alice Johnson',
            accountBalance: '506.35',
            status: 'active'
        },
        {
            fullName: 'David Smith',
            accountBalance: '951.68',
            status: 'active'
        },
        {
            fullName: 'Bob Taylor',
            accountBalance: '36.57',
            status: 'pending'
        },
        {
            fullName: 'George Davis',
            accountBalance: '563.84',
            status: 'active'
        },
        {
            fullName: 'Charlie Brown',
            accountBalance: '752.63',
            status: 'active'
        },
        {
            fullName: 'Bob Garcia',
            accountBalance: '457.22',
            status: 'pending'
        },
        {
            fullName: 'Hannah Miller',
            accountBalance: '352.67',
            status: 'active'
        },
        {
            fullName: 'Hannah Jones',
            accountBalance: '695.52',
            status: 'active'
        },
        {
            fullName: 'John Wilson',
            accountBalance: '651.23',
            status: 'active'
        },
        {
            fullName: 'David Brown',
            accountBalance: '938.06',
            status: 'active'
        },
        {
            fullName: 'Hannah Jones',
            accountBalance: '416.45',
            status: 'pending'
        }
    ];

export default function Clients() {
    const [clients, setClients] = useState(_clients);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Clients</CardTitle>
                <CardDescription>
                    Manage your clients and view their credit score performance.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total amount</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            clients.map((client, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {client.fullName}
                                    </TableCell>
                                    <TableCell>
                                        {client.status === "pending" && <Badge variant="warning">{client.status}</Badge>}
                                        {client.status === "blocked" && <Badge variant="destructive">{client.status}</Badge>}
                                        {client.status === "active" && <Badge variant="outline">{client.status}</Badge>}
                                    </TableCell>
                                    <TableCell>£ {client.accountBalance}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-warning" onClick={() => {
                                                    setClients(clients.map((c, i) => {
                                                        if (i === index) {
                                                            return {...c, status: "blocked"}
                                                        }
                                                        return c;
                                                        }));
                                                }}>Block</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>1-400</strong> of <strong>6235</strong> products
                </div>
            </CardFooter>
        </Card>
    )
}
