import React from "react";
import Navbar from "../components/Navbar";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-white mt-10 rounded-2xl shadow-sm mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-4">Last updated: December 18, 2025</p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            Welcome to Eluria School! These terms and conditions outline the
            rules and regulations for the use of Eluria School's Website,
            located at eluria.edu.
          </p>
          <p>
            By accessing this website we assume you accept these terms and
            conditions. Do not continue to use Eluria School if you do not agree
            to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-4">Cookies</h2>
          <p>
            We employ the use of cookies. By accessing Eluria School, you agreed
            to use cookies in agreement with the Eluria School's Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-4">License</h2>
          <p>
            Unless otherwise stated, Eluria School and/or its licensors own the
            intellectual property rights for all material on Eluria School. All
            intellectual property rights are reserved. You may access this from
            Eluria School for your own personal use subjected to restrictions
            set in these terms and conditions.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            User Comments
          </h2>
          <p>
            Parts of this website offer an opportunity for users to post and
            exchange opinions and information in certain areas of the website.
            Eluria School does not filter, edit, publish or review Comments
            prior to their presence on the website. Comments do not reflect the
            views and opinions of Eluria School,its agents and/or affiliates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
