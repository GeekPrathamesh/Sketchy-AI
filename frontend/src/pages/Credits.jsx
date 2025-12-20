import React, { useEffect, useState } from "react";
import { dummyPlans } from "../assets/assets";
import Loading from "./Loading";

const Credits = () => {
  const [plans, setplans] = useState([]);
  const [loading, setloading] = useState(true);

  const fetchPlans = () => {
    setplans(dummyPlans);
    setloading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="w-full h-full p-6 xl:px-20 bg-gray-50 dark:bg-[#0f0b14]">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-purple-200">
        Choose Your Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans?.map((plan) => (
          <div className="relative flex flex-col rounded-2xl p-6 bg-white dark:bg-[#1a1325] border border-gray-200 dark:border-purple-700 shadow-md hover:shadow-xl transition-all duration-300">
            {/* Plan Name */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-purple-200 mb-2">
              {plan.name}
            </h3>

            {/* Price */}
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
              ${plan.price}
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                /mo
              </span>
            </p>

            {/* Credits */}
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              {plan.credits} Credits included
            </p>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-purple-600 dark:text-purple-400">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Button */}
            <button className="mt-auto w-full py-2 rounded-xl font-medium bg-purple-600 hover:bg-purple-700 text-white transition">
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
