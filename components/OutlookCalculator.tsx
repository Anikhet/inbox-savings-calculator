"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculatorFormSchema,
  type CalculatorFormSchema,
} from "@/utils/validation";
import {
  calculateSavings,
  formatCurrency,
  formatPercentage,
} from "@/utils/calculator";
import { CalculationResults } from "@/types/calculator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  TrendingUp,
  Settings,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PulsatingButton } from "./magicui/pulsating-button";
import Image from "next/image";
import Link from "next/link";

export default function OutlookCalculator() {
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
        emailSequencerName: "Instantly",
        dailyEmailVolume: 2000,
        numberOfDomains: 23,
        totalMonthlyCost: 400,
        domainCost: 11.99,
      },
      ourOffer: {
        emailSequencerCost: 70,
        desiredDailyVolume: 2000,
        costPerDomain: 60,
        useExistingDomains: false,
        costForDomains: 11.99,
      },
    },
  });

  const useExistingDomains = watch("ourOffer.useExistingDomains");

  const onSubmit = (data: CalculatorFormSchema) => {
    if (data.ourOffer.useExistingDomains) {
      data.ourOffer.costForDomains = 0;
    }
    const calculatedResults = calculateSavings(
      data.currentCosts,
      data.ourOffer,
      "outlook"
    );
    setResults(calculatedResults);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link 
                href="https://peeker.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/peekerlogo.svg"
                  alt="Peeker.ai"
                  width={100}
                  height={30}
                  className="h-8 w-auto"
                />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold">
                  Outlook Inbox Cost Savings Calculator
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Calculate Outlook email infrastructure cost savings
                </p>
              </div>
            </div>
            {results && (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResults(null)}
                  className="w-full sm:w-auto"
                >
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
        <div
          className={cn(
            "grid gap-6",
            results
              ? "grid-cols-1 lg:grid-cols-3"
              : "grid-cols-1 lg:grid-cols-2"
          )}
        >
          {/* Form Section */}
          <div
            className={cn(
              "space-y-6",
              results ? "lg:col-span-1" : "lg:col-span-2"
            )}
          >
            <div
              className={cn(
                "grid gap-6",
                results ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
              )}
            >
              {/* Current Costs */}
              <Card className="border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-200">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <DollarSign className="h-5 w-5" />
                    Enter Your Current Costs
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    Enter your current email infrastructure costs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label
                      htmlFor="currentCosts.emailSequencerCost"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email sequencer cost (per month)
                    </Label>
                    <Input
                      id="currentCosts.emailSequencerCost"
                      type="number"
                      step="0.01"
                      {...register("currentCosts.emailSequencerCost", {
                        valueAsNumber: true,
                      })}
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
                    <Label
                      htmlFor="currentCosts.dailyEmailVolume"
                      className="text-sm font-medium text-gray-700"
                    >
                      How many emails do you send per day currently?
                    </Label>
                    <Input
                      id="currentCosts.dailyEmailVolume"
                      type="number"
                      {...register("currentCosts.dailyEmailVolume", {
                        valueAsNumber: true,
                      })}
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
                    <Label
                      htmlFor="currentCosts.numberOfDomains"
                      className="text-sm font-medium text-gray-700"
                    >
                      How many domains did you purchase to send this volume?
                    </Label>
                    <Input
                      id="currentCosts.numberOfDomains"
                      type="number"
                      {...register("currentCosts.numberOfDomains", {
                        valueAsNumber: true,
                      })}
                      placeholder="23"
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.currentCosts?.numberOfDomains && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.currentCosts.numberOfDomains.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="currentCosts.totalMonthlyCost"
                      className="text-sm font-medium text-gray-700"
                    >
                      Current cost of inboxes per month?
                    </Label>
                    <Input
                      id="currentCosts.totalMonthlyCost"
                      type="number"
                      step="0.01"
                      {...register("currentCosts.totalMonthlyCost", {
                        valueAsNumber: true,
                      })}
                      placeholder="400"
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.currentCosts?.totalMonthlyCost && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.currentCosts.totalMonthlyCost.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="currentCosts.domainCost"
                      className="text-sm font-medium text-gray-700"
                    >
                      Cost per domain?
                    </Label>
                    <Input
                      id="currentCosts.domainCost"
                      type="number"
                      {...register("currentCosts.domainCost", {
                        valueAsNumber: true,
                      })}
                      placeholder="11.99"
                      className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.currentCosts?.domainCost && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.currentCosts.domainCost.message}
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
                  <CardDescription className="text-green-600">
                    Configure our custom offer and see the savings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label
                      htmlFor="ourOffer.emailSequencerCost"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email sequencer
                    </Label>
                    <Input
                      id="ourOffer.emailSequencerCost"
                      type="number"
                      step="0.01"
                      {...register("ourOffer.emailSequencerCost", {
                        valueAsNumber: true,
                      })}
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
                    <Label
                      htmlFor="ourOffer.desiredDailyVolume"
                      className="text-sm font-medium text-gray-700"
                    >
                      Desired daily volume
                    </Label>
                    <Input
                      id="ourOffer.desiredDailyVolume"
                      type="number"
                      {...register("ourOffer.desiredDailyVolume", {
                        valueAsNumber: true,
                      })}
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
                    <Label
                      htmlFor="domainsNeeded"
                      className="text-sm font-medium text-gray-700"
                    >
                      Number of domains needed
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="domainsNeeded"
                        type="number"
                        value={Math.ceil(
                          watch("ourOffer.desiredDailyVolume") / 500
                        )}
                        readOnly
                        className="bg-gray-50 border-gray-300 text-gray-700"
                      />
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                      >
                        500 emails/domain
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="ourOffer.costPerDomain"
                      className="text-sm font-medium text-gray-700"
                    >
                      Our cost for inboxes per domain
                    </Label>
                    <Input
                      id="ourOffer.costPerDomain"
                      type="number"
                      step="0.01"
                      {...register("ourOffer.costPerDomain", {
                        valueAsNumber: true,
                      })}
                      placeholder="60"
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
                      <Label
                        htmlFor="ourOffer.costForDomains"
                        className="text-sm font-medium text-gray-700"
                      >
                        Cost per domain?
                      </Label>
                      <Input
                        id="ourOffer.costForDomains"
                        type="number"
                        {...register("ourOffer.costForDomains", {
                          valueAsNumber: true,
                        })}
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
                      onCheckedChange={(checked) => {
                        setValue("ourOffer.useExistingDomains", checked);
                        setValue(
                          "ourOffer.costForDomains",
                          checked ? 0 : watch("ourOffer.costForDomains")
                        );
                      }}
                    />
                    <Label
                      htmlFor="ourOffer.useExistingDomains"
                      className="text-sm font-medium text-gray-700"
                    >
                      Bring your existing domains
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200">
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
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
                        <span className="text-white font-medium text-sm sm:text-base">
                          SAVINGS CALCULATED
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-4xl sm:text-6xl font-black text-white mb-2 drop-shadow-lg">
                      {formatCurrency(results.totalSavings)}
                    </CardTitle>
                    <CardDescription className="text-lg sm:text-2xl text-white/90 font-semibold mb-4">
                      Monthly Savings •{" "}
                      {formatPercentage(results.totalSavingsPercentage)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 inline-block">
                        <div className="text-white/80 text-base sm:text-lg mb-2">
                          Annual Savings
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-white">
                          {formatCurrency(results.totalSavings * 12)}
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
                    <div className="text-xs sm:text-sm text-green-600">
                      Sequencer Savings
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-700 mb-1">
                      {formatCurrency(results.emailInboxSavings)}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600">
                      Inbox Savings
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-purple-700 mb-1">
                      {formatCurrency(results.domainSavings)}
                    </div>
                    <div className="text-xs sm:text-sm text-purple-600">
                      Domain Savings
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Before and After Comparison */}
              <Card className="border-2 border-green-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
                    Before & After Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Before */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-red-700 mb-2">
                          Current Costs
                        </h3>
                        <div className="text-3xl font-bold text-red-600">
                          {formatCurrency(
                            results.currentTotalWithDomains -
                              results.currentDomainCost
                          )}
                        </div>
                        <p className="text-sm text-gray-600">per month</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                          <span className="text-sm font-medium text-gray-700">
                            Email Sequencer
                          </span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(
                              watch("currentCosts.emailSequencerCost")
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                          <span className="text-sm font-medium text-gray-700">
                            Inbox Costs
                          </span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(
                              watch("currentCosts.totalMonthlyCost")
                            )}
                          </span>
                        </div>
                        <div className="flex justify-center items-center">
                          <span className="text-4xl font-extrabold text-gray-700">
                            +
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                          <span className="text-sm font-medium text-gray-700">
                            Domain Costs
                          </span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(
                              watch("currentCosts.numberOfDomains") *
                                watch("currentCosts.domainCost")
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* After */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-green-700 mb-2">
                          Our Offer
                        </h3>
                        <div className="text-3xl font-bold text-green-600">
                          {formatCurrency(results.ourTotalCost)}
                        </div>
                        <p className="text-sm text-gray-600">per month</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-sm font-medium text-gray-700">
                            Our Email Sequencer
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(
                              watch("ourOffer.emailSequencerCost")
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-sm font-medium text-gray-700">
                            Our Inbox Costs
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(
                              results.domainsNeeded *
                                watch("ourOffer.costPerDomain")
                            )}
                          </span>
                        </div>
                        <div className="flex justify-center items-center">
                          <span className="text-4xl font-extrabold text-gray-700">
                            +
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-sm font-medium text-gray-700">
                            Your Domain Costs
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(
                              watch("ourOffer.costForDomains") *
                                (watch("ourOffer.desiredDailyVolume") / 500)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Savings Summary */}
                  <div className="bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 rounded-xl p-6 border-2 border-gray-200">
                    <div className="text-center flex flex-col justify-center items-center">
                      <div className="text-lg font-semibold text-gray-800 mb-2">
                        Ready to start saving{" "}
                        {formatCurrency(results.totalSavings)} per month?
                      </div>
                      <div className="text-xl font-semibold text-green-600 mb-4"></div>

                      <PulsatingButton
                        onClick={() => {
                          window.location.href =
                            "https://cal.com/conrad-niedzielski/inboxes-chat";
                        }}
                        className="bg-emerald-500"
                        pulseColor=""
                      >
                        Start Saving
                      </PulsatingButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 