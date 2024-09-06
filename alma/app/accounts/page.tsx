"use client";

import React, { useEffect, useState } from 'react';
import { Table, Pagination } from 'flowbite-react';
import { Spinner } from 'flowbite-react';


interface Account {
  id: number;
  name: string;
  email: string;
  // Add any other fields you expect in the accounts data
}

interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  pageSize: number;
}

const AccountsListingPage = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const pageSize = 10;

  const fetchAccounts = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/accounts?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) throw new Error('Failed to fetch accounts');

      const data: PaginatedResponse<Account> = await response.json();
      setAccounts(data.results);
      setTotal(data.total);
      setPage(data.page);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(page);
  }, [page]);

  if (loading) return <Spinner aria-label="Loading accounts" />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 dark:bg-gray-800 dark:text-white">
      <h2 className="text-2xl font-semibold">Accounts</h2>
      <div className="mt-4 overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {accounts.map((account) => (
              <Table.Row key={account.id} className="bg-white dark:bg-gray-700">
                <Table.Cell>{account.id}</Table.Cell>
                <Table.Cell>{account.name}</Table.Cell>
                <Table.Cell>{account.email}</Table.Cell>
                <Table.Cell>
                  <a href={`/accounts/${account.id}/edit`} className="text-blue-600 hover:underline">Edit</a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / pageSize)}
          onPageChange={(p: number) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default AccountsListingPage;