import React from 'react';
import AuraBrandDiscovery from '../components/ai/AuraBrandDiscovery';

const BrandDiscoveryTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ✨ Aura Brand Discovery Test
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Testing the brand discovery conversation flow and preview system
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <AuraBrandDiscovery />
        </div>
      </div>
    </div>
  );
};

export default BrandDiscoveryTest;