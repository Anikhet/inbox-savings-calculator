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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, DollarSign, TrendingUp, Settings, BarChart3, Home, Target, Zap, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InboxCalculator() {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [activeTab, setActiveTab] = useState("calculator");

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
        domainCostPerMonth: 11.99,
        totalMonthlyCost: 400,
      },
      ourOffer: {
        emailSequencerCost: 70,
        desiredDailyVolume: 2000,
        costPerDomain: 30,
        useExistingDomains: false,
        costForDomains: 47.96,
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
    setActiveTab("results");
    console.log(data.ourOffer.costForDomains)
  };

  const navigationItems = [
    {
      id: "calculator",
      label: "Calculator",
      icon: Calculator,
      description: "Configure your costs"
    },
    {
      id: "results", 
      label: "Results",
      icon: BarChart3,
      description: "View savings breakdown",
      badge: results ? formatCurrency(results.totalSavings) : undefined
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Enhanced Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-slate-900 to-slate-800 pt-5 pb-4 overflow-y-auto">
          {/* Logo/Brand */}
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Calculator className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-white">Cost Calculator</h1>
              <p className="text-xs text-slate-400">Pro Edition</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                Tools
              </h3>
            </div>
            
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 mr-3 transition-colors",
                    activeTab === item.id ? "text-primary-foreground" : "text-slate-400 group-hover:text-white"
                  )} />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs mt-0.5",
                      activeTab === item.id ? "text-primary-foreground/80" : "text-slate-500 group-hover:text-slate-300"
                    )}>
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}

            <Separator className="my-6 bg-slate-700" />

            {/* Quick Stats */}
            {results && (
              <div className="px-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Monthly Savings</span>
                      <span className="text-sm font-semibold text-green-400">
                        {formatCurrency(results.totalSavings)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Annual Savings</span>
                      <span className="text-sm font-semibold text-blue-400">
                        {formatCurrency(results.annualSavings)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Savings %</span>
                      <span className="text-sm font-semibold text-yellow-400">
                        {formatPercentage(results.totalSavingsPercentage)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Separator className="my-6 bg-slate-700" />

            {/* Footer */}
            <div className="px-2">
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-yellow-400 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-white">Exclusive Deal</p>
                    <p className="text-xs text-slate-400">Reseller pricing available</p>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex flex-col flex-1">
        {/* Header */}
        <header className="bg-card border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Inbox Cost Savings Calculator</h1>
              <p className="text-muted-foreground">
                Calculate your email infrastructure cost savings with our exclusive reseller agreements
              </p>
            </div>
            {results && (
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <div>
                      <div className="text-xs opacity-90">SAVING</div>
                      <div className="text-xl font-bold">{formatCurrency(results.totalSavings)}/month</div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("calculator")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Recalculate
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="calculator" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Current Costs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Current Costs
                    </CardTitle>
                    <CardDescription>Enter your current email infrastructure costs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* <div>
                      <Label htmlFor="currentCosts.emailSequencerName">Email Sequencer Name</Label>
                      <Input
                        id="currentCosts.emailSequencerName"
                        type="text"
                        {...register('currentCosts.emailSequencerName')}
                        placeholder="e.g., Instantly, Smartly"
                      />
                      {errors.currentCosts?.emailSequencerName && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.currentCosts.emailSequencerName.message}
                        </p>
                      )}
                    </div> */}
                    <div>
                      <Label htmlFor="currentCosts.emailSequencerCost">Email Sequencer Cost (per month)</Label>
                      <Input
                        id="currentCosts.emailSequencerCost"
                        type="number"
                        step="0.01"
                        {...register('currentCosts.emailSequencerCost', { valueAsNumber: true })}
                        placeholder="97"
                      />
                      {errors.currentCosts?.emailSequencerCost && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.currentCosts.emailSequencerCost.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="currentCosts.dailyEmailVolume">How many emails do you send per day?</Label>
                      <Input
                        id="currentCosts.dailyEmailVolume"
                        type="number"
                        {...register('currentCosts.dailyEmailVolume', { valueAsNumber: true })}
                        placeholder="2000"
                      />
                      {errors.currentCosts?.dailyEmailVolume && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.currentCosts.dailyEmailVolume.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="currentCosts.numberOfDomains">How many domains did you purchase to send this volume?</Label>
                      <Input
                        id="currentCosts.numberOfDomains"
                        type="number"
                        {...register('currentCosts.numberOfDomains', { valueAsNumber: true })}
                        placeholder="22"
                      />
                      {errors.currentCosts?.numberOfDomains && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.currentCosts.numberOfDomains.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="currentCosts.totalMonthlyCost">How much do you currently pay per month? </Label>
                      <Input
                        id="currentCosts.totalMonthlyCost"
                        type="number"
                        step="0.01"
                        {...register('currentCosts.totalMonthlyCost', { valueAsNumber: true })}
                        placeholder="400"
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Our Offer
                    </CardTitle>
                    <CardDescription>Configure your custom offer and see the savings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="ourOffer.emailSequencerCost">Email Sequencer</Label>
                      <Input
                        id="ourOffer.emailSequencerCost"
                        type="number"
                        step="0.01"
                        {...register('ourOffer.emailSequencerCost', { valueAsNumber: true })}
                        placeholder="70"
                      />
                      <p className="text-xs text-gray-500 mt-1">***this value is something input custom each time (since i quote them different prices each time). It can be zero also.</p>
                      {errors.ourOffer?.emailSequencerCost && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.ourOffer.emailSequencerCost.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="ourOffer.desiredDailyVolume">Desired Daily Volume</Label>
                      <Input
                        id="ourOffer.desiredDailyVolume"
                        type="number"
                        {...register('ourOffer.desiredDailyVolume', { valueAsNumber: true })}
                        placeholder="2000"
                      />
                      {errors.ourOffer?.desiredDailyVolume && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.ourOffer.desiredDailyVolume.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="domainsNeeded">Number of Domains Needed</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="domainsNeeded"
                          type="number"
                          value={Math.ceil(watch('ourOffer.desiredDailyVolume') / 500)}
                          readOnly
                          className="bg-gray-50"
                        />
                        <Badge variant="outline" className="text-xs">
                          500 emails/domain
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">**our infrastructure can send 500 sends/domain</p>
                    </div>
                    <div>
                      <Label htmlFor="ourOffer.costPerDomain">Cost for 500 email sends (1 domain)</Label>
                      <Input
                        id="ourOffer.costPerDomain"
                        type="number"
                        step="0.01"
                        {...register('ourOffer.costPerDomain', { valueAsNumber: true })}
                        placeholder="30"
                      />
                      <p className="text-xs text-gray-500 mt-1">***this value is something input custom each time (since i quote them different prices each time)</p>
                      {errors.ourOffer?.costPerDomain && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.ourOffer.costPerDomain.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        id="ourOffer.useExistingDomains"
                        checked={useExistingDomains}
                        onCheckedChange={handleExistingDomainsChange}
                      />
                      <Label htmlFor="ourOffer.useExistingDomains">Bring your existing domains</Label>
                    </div>
                    {!useExistingDomains && (
                      <div>
                        <Label htmlFor="ourOffer.costForDomains">Number of Existing Domains</Label>
                        <Input
                          id="ourOffer.costForDomains"
                          type="number"
                          {...register('ourOffer.costForDomains', { valueAsNumber: true })}
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">*this can be zero as well if a checkmark is clicked saying "bring your existing domains"</p>
                        {errors.ourOffer?.costForDomains && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.ourOffer.costForDomains.message}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSubmit(onSubmit)} className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Calculate Savings
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {results ? (
                <>
                  {/* Enhanced Main Savings Card */}
                  <Card className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 border-0 shadow-2xl overflow-hidden">
                    <div className="relative">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                      
                      <CardHeader className="text-center relative z-10 pb-4">
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-white" />
                            <span className="text-white font-medium">SAVINGS CALCULATED</span>
                          </div>
                        </div>
                        <CardTitle className="text-6xl font-black text-white mb-2 drop-shadow-lg">
                          {formatCurrency(results.totalSavings)}
                        </CardTitle>
                        <CardDescription className="text-2xl text-white/90 font-semibold mb-4">
                          Monthly Savings • {formatPercentage(results.totalSavingsPercentage)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="text-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                            <div className="text-white/80 text-lg mb-2">Annual Savings</div>
                            <div className="text-4xl font-bold text-white">
                              {formatCurrency(results.annualSavings)}
                            </div>
                            <div className="text-white/70 text-sm mt-2">That's {formatCurrency(results.totalSavings * 12)} per year!</div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>

                  {/* Savings Impact Cards */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-700 mb-1">
                          {formatCurrency(results.sequencerSavings)}
                        </div>
                        <div className="text-sm text-green-600">Sequencer Savings</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-700 mb-1">
                          {formatCurrency(results.emailInboxSavings)}
                        </div>
                        <div className="text-sm text-blue-600">Inbox Savings</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-700 mb-1">
                          {formatCurrency(results.domainSavings)}
                        </div>
                        <div className="text-sm text-purple-600">Domain Savings</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Enhanced Savings Breakdown */}
                    <Card className="border-2 border-green-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                        <CardTitle className="flex items-center gap-2 text-green-800">
                          <BarChart3 className="h-6 w-6" />
                          Detailed Savings Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
                          <div>
                            <span className="text-gray-700 font-medium">Email Sequencer Savings</span>
                            <p className="text-sm text-gray-500">Reduced sequencer costs</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-600 block">
                              {formatCurrency(results.sequencerSavings)}
                            </span>
                            <span className="text-sm text-green-600">per month</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div>
                            <span className="text-gray-700 font-medium">Email Inbox Savings</span>
                            <p className="text-sm text-gray-500">Infrastructure cost reduction</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-blue-600 block">
                              {formatCurrency(results.emailInboxSavings)}
                            </span>
                            <span className="text-sm text-blue-600">{formatPercentage(results.emailInboxSavingsPercentage)} savings</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                          <div>
                            <span className="text-gray-700 font-medium">Domain Savings</span>
                            <p className="text-sm text-gray-500">Optimized domain usage</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-purple-600 block">
                              {formatCurrency(results.domainSavings)}
                            </span>
                            <span className="text-sm text-purple-600">per month</span>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300">
                          <div>
                            <span className="text-xl font-bold text-green-800">Total Monthly Savings</span>
                            <p className="text-sm text-green-700">Your guaranteed savings</p>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-black text-green-700 block">
                              {formatCurrency(results.totalSavings)}
                            </span>
                            <span className="text-lg font-semibold text-green-600">{formatPercentage(results.totalSavingsPercentage)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Infrastructure Details */}
                    <Card className="border-2 border-blue-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                          <Settings className="h-6 w-6" />
                          Infrastructure Comparison
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <span className="text-gray-700 font-medium">Domains Needed</span>
                          <Badge variant="outline" className="text-lg px-3 py-1">{results.domainsNeeded}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200">
                          <span className="text-gray-700 font-medium">Our Total Monthly Cost</span>
                          <span className="text-xl font-bold text-green-600">
                            {formatCurrency(results.ourTotalCost)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl border border-red-200">
                          <span className="text-gray-700 font-medium">Your Current Total Cost</span>
                          <span className="text-xl font-bold text-red-600">
                            {formatCurrency(results.currentTotalWithDomains)}
                          </span>
                        </div>
                        <Separator className="my-4" />
                        <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-xl p-4 border border-gray-200">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-800 mb-2">Cost Reduction</div>
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(results.currentTotalWithDomains - results.ourTotalCost)}
                            </div>
                            <div className="text-sm text-gray-600">less per month</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Enhanced Call to Action */}
                  <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-0 shadow-2xl overflow-hidden">
                    <div className="relative">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
                      
                      <CardHeader className="text-center relative z-10">
                        <CardTitle className="text-3xl font-bold text-white mb-4">
                          Ready to start saving money?
                        </CardTitle>
                        <CardDescription className="text-xl text-white/90 mb-6">
                          Switch to our infrastructure and save <span className="font-bold text-white">{formatCurrency(results.totalSavings)}</span> every month!
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="relative z-10 text-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                          <div className="text-white/80 text-lg mb-2">That's</div>
                          <div className="text-4xl font-bold text-white mb-2">
                            {formatCurrency(results.annualSavings)}
                          </div>
                          <div className="text-white/70">in your pocket every year!</div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="text-center py-12">
                    <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg text-gray-500">
                      Fill out the calculator form and click "Calculate Savings" to see your potential savings
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
} 