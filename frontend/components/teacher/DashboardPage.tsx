"use client";

import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StakingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top Navbar */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">
            Top Staking Assets
          </h1>

          <div className="flex items-center gap-4">
            <input
              placeholder="Search..."
              className="px-4 py-2 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <Button className="rounded-xl">Deposit</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        
        {/* Top Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Ethereum (ETH)", rate: "13.62%", change: "+6.25%" },
            { name: "BNB Chain", rate: "12.72%", change: "+5.67%" },
            { name: "Polygon (MATIC)", rate: "6.29%", change: "-1.89%" },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Proof of Stake</p>
                  <h3 className="font-semibold text-lg mt-1">
                    {item.name}
                  </h3>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-black transition" />
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500">Reward Rate</p>
                <div className="flex items-end gap-3 mt-1">
                  <span className="text-3xl font-bold">{item.rate}</span>
                  <span
                    className={`text-sm ${
                      item.change.includes("-")
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
              </div>

              {/* Fake Graph Line */}
              <div className="mt-6 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Active Staking Section */}
        <div className="bg-white border rounded-3xl shadow-sm p-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Your Active Staking</p>
              <h2 className="text-2xl font-semibold mt-1">
                Stake Avalanche (AVAX)
              </h2>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl">
                Upgrade
              </Button>
              <Button className="rounded-xl">Unstake</Button>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Current Reward</p>
              <p className="text-3xl font-bold mt-2">31.39 AVAX</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-2xl font-semibold mt-2">$41.99</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Staking Ratio</p>
              <p className="text-2xl font-semibold mt-2">60.6%</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500">Expected Profit</p>
              <p className="text-2xl font-semibold mt-2 text-green-600">
                +22.3%
              </p>
            </div>
          </div>

          {/* Investment Slider Placeholder */}
          <div className="mt-10 bg-gray-50 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-4">
              Investment Period (Months)
            </p>
            <input
              type="range"
              min="1"
              max="12"
              className="w-full accent-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}