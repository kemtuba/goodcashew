import { useRouter } from 'next/router';
import React from 'react';

const IndexPage: React.FC = () => {
  const router = useRouter();

  const handleRoleClick = (role: string) => {
    router.push(`/login?role=${role}`);
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Welcome to GoodCashew</h1>
      <p className="mb-6">Select your role to begin:</p>

      <div className="grid gap-4">
        <button
          onClick={() => handleRoleClick('farmer')}
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          I’m a Farmer
        </button>
        <button
          onClick={() => handleRoleClick('extension_worker')}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          I’m an Extension Worker
        </button>
        <button
          onClick={() => handleRoleClick('admin')}
          className="bg-gray-600 text-white py-2 px-4 rounded"
        >
          I’m an Administrator
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
