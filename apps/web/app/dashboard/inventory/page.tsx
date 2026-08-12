"use client";
import { Menus } from "@/components/menu/Menus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InventoryPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#1F384C] text-lg leading-5.75">
        Inventory Management
      </h2>

      <Tabs defaultValue="menu">
        <TabsList variant="line">
          <TabsTrigger value="menu">Menu Item</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="menu">
          <Menus />
        </TabsContent>
        <TabsContent value="inventory"></TabsContent>
      </Tabs>
    </div>
  );
}
