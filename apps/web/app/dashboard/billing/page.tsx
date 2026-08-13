"use client";
import { Folios } from "@/components/folio/Folios";
import { Payments } from "@/components/payment/Payments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BillingPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#1F384C] text-lg leading-5.75">Billing</h2>

      <Tabs defaultValue="folio">
        <TabsList variant="line">
          <TabsTrigger value="folio">Folio</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="folio">
          <Folios />
        </TabsContent>
        <TabsContent value="payment">
          <Payments />
        </TabsContent>
      </Tabs>
    </div>
  );
}
