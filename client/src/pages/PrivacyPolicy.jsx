import React from "react";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-white mt-10 rounded-2xl shadow-sm mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-4">Last updated: December 18, 2025</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            At Eluria School, accessible from eluria.edu, one of our main
            priorities is the privacy of our visitors. This Privacy Policy
            document contains types of information that is collected and
            recorded by Eluria School and how we use it.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            Information We Collect
          </h2>
          <p>
            When you register for an account, we may ask for your personal
            information, including items such as name, email address, student
            admission number, and contact details.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide, operate, and maintain our school management system</li>
            <li>Improve, personalize, and expand our website</li>
            <li>Understand and analyze how you use our website</li>
            <li>
              communicate with you, either directly or through one of our
              partners
            </li>
            <li>Send you emails regarding school updates, results, and fees</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-4">Log Files</h2>
          <p>
            Eluria School follows a standard procedure of using log files. These
            files log visitors when they visit websites. All hosting companies
            do this and a part of hosting services' analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
