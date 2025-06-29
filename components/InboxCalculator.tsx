'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculatorFormSchema, type CalculatorFormSchema } from '@/utils/validation';
import { calculateSavings, formatCurrency, formatPercentage } from '@/utils/calculator';
import { CalculationResults } from '@/types/calculator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, DollarSign, TrendingUp, Settings, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InboxCalculator() {
  const [results, setResults] = useState<CalculationResults | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CalculatorFormSchema>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: {
      currentCosts: {
        emailSequencerCost: 97,
        emailSequencerName: 'Instantly',
        dailyEmailVolume: 2000,
        numberOfDomains: 22,

        totalMonthlyCost: 400,
        domainCost : 11.99,
      },
      ourOffer: {
        emailSequencerCost: 70,
        desiredDailyVolume: 2000,
        costPerDomain: 30,
        useExistingDomains: false,
        costForDomains: 11.99,
      },
    },
  });

  const useExistingDomains = watch('ourOffer.useExistingDomains');

  const handleExistingDomainsChange = (checked: boolean) => {
    setValue('ourOffer.useExistingDomains', checked);
  };

  const onSubmit = (data: CalculatorFormSchema) => {
    if (data.ourOffer.useExistingDomains){
      data.ourOffer.costForDomains = 0
    }
    const calculatedResults = calculateSavings(data.currentCosts, data.ourOffer);
    setResults(calculatedResults);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">Inbox Cost Savings Calculator</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Calculate your email infrastructure cost savings with our exclusive reseller agreements
              </p>
            </div>
            {results && (
              <div className="flex flex-col sm:flex-row items-center gap-3">
        
                <Button variant="outline" size="sm" onClick={() => setResults(null)} className="w-full sm:w-auto">
                  <Settings className="h-4 w-4 mr-2" />
                  Recalculate
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className={cn(
          "grid gap-6",
          results ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2"
        )}>
          {/* Form Section */}
          <div className={cn(
            "space-y-6",
            results ? "lg:col-span-1" : "lg:col-span-2"
          )}>
            <div className={cn(
              "grid gap-6",
              results ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            )}>
              {/* Current Costs */}
              <Card className="border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-200">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <DollarSign className="h-5 w-5" />
                    Current Costs
                  </CardTitle>
                  <CardDescription className="text-blue-600">Enter your current email infrastructure costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label htmlFor="currentCosts.emailSequencerCost" className="text-sm font-medium text-gray-700">Email Sequencer Cost (per month)</Label>
                    <Input
                      id="currentCosts.emailSequencerCost"
                      type="number"
                      step="0.01"
                      {...register('currentCosts.emailSequencerCost', { valueAsNumber: true })}
                      placeholder="97"
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.currentCosts?.emailSequencerCost && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.currentCosts.emailSequencerCost.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="currentCosts.dailyEmailVolume" className="text-sm font-medium text-gray-700">How many emails do you send per day currently?</Label>
                    <Input
                      id="currentCosts.dailyEmailVolume"
                      type="number"
                      {...register('currentCosts.dailyEmailVolume', { valueAsNumber: true })}
                      placeholder="2000"
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.currentCosts?.dailyEmailVolume && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.currentCosts.dailyEmailVolume.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="currentCosts.numberOfDomains" className="text-sm font-medium text-gray-700">How many domains did you purchase to send this volume?</Label>
                    <Input
                      id="currentCosts.numberOfDomains"
                      type="number"
                      {...register('currentCosts.numberOfDomains', { valueAsNumber: true })}
                      placeholder="22"
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.currentCosts?.numberOfDomains && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.currentCosts.numberOfDomains.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="currentCosts.domainCost" className="text-sm font-medium text-gray-700">Cost per domain?</Label>
                    <Input
                      id="currentCosts.domainCost"
                      type="number"
                      {...register('currentCosts.domainCost', { valueAsNumber: true })}
                      placeholder="11.99"
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.currentCosts?.domainCost && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.currentCosts.domainCost.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="currentCosts.totalMonthlyCost" className="text-sm font-medium text-gray-700">How much do you currently pay per month?</Label>
                    <Input
                      id="currentCosts.totalMonthlyCost"
                      type="number"
                      step="0.01"
                      {...register('currentCosts.totalMonthlyCost', { valueAsNumber: true })}
                      placeholder="400"
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.currentCosts?.totalMonthlyCost && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.currentCosts.totalMonthlyCost.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Our Offer */}
              <Card className="border-2 border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-200">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Settings className="h-5 w-5" />
                    Our Offer
                  </CardTitle>
                  <CardDescription className="text-green-600">Configure your custom offer and see the savings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label htmlFor="ourOffer.emailSequencerCost" className="text-sm font-medium text-gray-700">Email Sequencer</Label>
                    <Input
                      id="ourOffer.emailSequencerCost"
                      type="number"
                      step="0.01"
                      {...register('ourOffer.emailSequencerCost', { valueAsNumber: true })}
                      placeholder="70"
                      className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.ourOffer?.emailSequencerCost && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.ourOffer.emailSequencerCost.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ourOffer.desiredDailyVolume" className="text-sm font-medium text-gray-700">Desired Daily Volume</Label>
                    <Input
                      id="ourOffer.desiredDailyVolume"
                      type="number"
                      {...register('ourOffer.desiredDailyVolume', { valueAsNumber: true })}
                      placeholder="2000"
                      className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.ourOffer?.desiredDailyVolume && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.ourOffer.desiredDailyVolume.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="domainsNeeded" className="text-sm font-medium text-gray-700">Number of Domains Needed</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="domainsNeeded"
                        type="number"
                        value={Math.ceil(watch('ourOffer.desiredDailyVolume') / 500)}
                        readOnly
                        className="bg-gray-50 border-gray-300 text-gray-700"
                      />
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        500 emails/domain
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ourOffer.costPerDomain" className="text-sm font-medium text-gray-700">Cost for 500 email sends (1 domain)</Label>
                    <Input
                      id="ourOffer.costPerDomain"
                      type="number"
                      step="0.01"
                      {...register('ourOffer.costPerDomain', { valueAsNumber: true })}
                      placeholder="30"
                      className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.ourOffer?.costPerDomain && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.ourOffer.costPerDomain.message}
                      </p>
                    )}
                  </div>
                     {!useExistingDomains && (
                    <div>
                      <Label htmlFor="ourOffer.costForDomains" className="text-sm font-medium text-gray-700">Cost per domain?</Label>
                      <Input
                        id="ourOffer.costForDomains"
                        type="number"
                        {...register('ourOffer.costForDomains', { valueAsNumber: true })}
                        placeholder="0"
                        className="mt-1 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                      {errors.ourOffer?.costForDomains && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.ourOffer.costForDomains.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Switch
                      id="ourOffer.useExistingDomains"
                      checked={useExistingDomains}
                      onCheckedChange={handleExistingDomainsChange}
                    />
                    <Label htmlFor="ourOffer.useExistingDomains" className="text-sm font-medium text-gray-700">Bring your existing domains</Label>
                  </div>
               
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200">
                  <Button onClick={handleSubmit(onSubmit)} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Calculate Savings
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-6 lg:col-span-2">
              {/* Main Savings Card */}
              <Card className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 border-0 shadow-2xl overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full translate-y-10 sm:translate-y-12 -translate-x-10 sm:-translate-x-12"></div>
                  
                  <CardHeader className="text-center relative z-10 pb-4">
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 mb-4">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        <span className="text-white font-medium text-sm sm:text-base">SAVINGS CALCULATED</span>
                      </div>
                    </div>
                    <CardTitle className="text-4xl sm:text-6xl font-black text-white mb-2 drop-shadow-lg">
                      {formatCurrency(results.totalSavings)}
                    </CardTitle>
                    <CardDescription className="text-lg sm:text-2xl text-white/90 font-semibold mb-4">
                      Monthly Savings • {formatPercentage(results.totalSavingsPercentage)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 inline-block">
                        <div className="text-white/80 text-base sm:text-lg mb-2">Annual Savings</div>
                        <div className="text-3xl sm:text-4xl font-bold text-white">
                          {formatCurrency(results.annualSavings)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Savings Impact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-green-700 mb-1">
                      {formatCurrency(results.sequencerSavings)}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600">Sequencer Savings</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-700 mb-1">
                      {formatCurrency(results.emailInboxSavings)}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600">Inbox Savings</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-700 mb-1">
                      {formatCurrency(results.domainSavings)}
                    </div>
                    <div className="text-xs sm:text-sm text-purple-600">Domain Savings</div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Breakdown */}
              <Card className="border-2 border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                    Detailed Savings Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-green-50 rounded-xl border border-green-200 gap-2">
                    <div>
                      <span className="text-gray-700 font-medium text-sm sm:text-base">Email Sequencer Savings</span>
                      <p className="text-xs sm:text-sm text-gray-500">Reduced sequencer costs</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-bold text-green-600 block">
                        {formatCurrency(results.sequencerSavings)}
                      </span>
                      <span className="text-xs sm:text-sm text-green-600">per month</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-blue-50 rounded-xl border border-blue-200 gap-2">
                    <div>
                      <span className="text-gray-700 font-medium text-sm sm:text-base">Email Inbox Savings</span>
                      <p className="text-xs sm:text-sm text-gray-500">Infrastructure cost reduction</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-bold text-blue-600 block">
                        {formatCurrency(results.emailInboxSavings)}
                      </span>
                      <span className="text-xs sm:text-sm text-blue-600">{formatPercentage(results.emailInboxSavingsPercentage)} savings</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-purple-50 rounded-xl border border-purple-200 gap-2">
                    <div>
                      <span className="text-gray-700 font-medium text-sm sm:text-base">Domain Savings</span>
                      <p className="text-xs sm:text-sm text-gray-500">Optimized domain usage</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-bold text-purple-600 block">
                        {formatCurrency(results.domainSavings)}
                      </span>
                      <span className="text-xs sm:text-sm text-purple-600">per month</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300 gap-2">
                    <div>
                      <span className="text-lg sm:text-xl font-bold text-green-800">Total Monthly Savings</span>
                      <p className="text-xs sm:text-sm text-green-700">Your guaranteed savings</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-black text-green-700 block">
                        {formatCurrency(results.totalSavings)}
                      </span>
                      <span className="text-base sm:text-lg font-semibold text-green-600">{formatPercentage(results.totalSavingsPercentage)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

          

              {/* Call to Action */}
              {/* <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-0 shadow-2xl overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full -translate-y-16 sm:-translate-y-20 translate-x-16 sm:translate-x-20"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full translate-y-12 sm:translate-y-16 -translate-x-12 sm:-translate-x-16"></div>
                  
                  <CardHeader className="text-center relative z-10">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-4">
                      Ready to start saving money?
                    </CardTitle>
                    <CardDescription className="text-lg sm:text-xl text-white/90 mb-6">
                      Switch to our infrastructure and save <span className="font-bold text-white">{formatCurrency(results.totalSavings)}</span> every month!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 inline-block">
                      <div className="text-white/80 text-base sm:text-lg mb-2">That's</div>
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {formatCurrency(results.annualSavings)}
                      </div>
                      <div className="text-white/70 text-sm sm:text-base">in your pocket every year!</div>
                    </div>
                  </CardContent>
                </div>
              </Card> */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 