"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import OutlookCalculator from "./OutlookCalculator";
import GoogleCalculator from "./GoogleCalculator";
import Image from "next/image";
import Link from "next/link";

export default function InboxCalculator() {
  const [provider, setProvider] = useState<"outlook" | "google">("outlook");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-center py-4">
        <Tabs
          value={provider}
          onValueChange={(val) =>
            val && setProvider(val as "outlook" | "google")
          }
        >
          <TabsList>
            <TabsTrigger value="outlook">Outlook</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
          </TabsList>
          <TabsContent value="outlook">
            <OutlookCalculator />
          </TabsContent>
          <TabsContent value="google">
            <GoogleCalculator />
          </TabsContent>
        </Tabs>
      </div>
      <footer className="text-center py-6 border-t bg-card">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Powered by</span>
          <Link 
            href="https://peeker.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/peekerlogo.svg"
              alt="Peeker.ai"
              width={80}
              height={24}
              className="h-6 w-auto"
            />
          </Link>
        </div>
      </footer>
    </div>
  );
}
