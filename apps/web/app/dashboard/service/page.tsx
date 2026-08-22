"use client";
import { GymMemberships } from "@/components/gym/GymMemberships";
import { LaundryOrders } from "@/components/laundry/LaundryOrders";
import { RestaurantOrders } from "@/components/restaurantorder/RestaurantOrders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ServicePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#1F384C] text-lg leading-5.75">
        Service Management
      </h2>

      <Tabs defaultValue="restaurantorder">
        <TabsList variant="line">
          <TabsTrigger value="restaurantorder">Restaurant Order</TabsTrigger>
          <TabsTrigger value="gym">Gym Membership</TabsTrigger>
          <TabsTrigger value="laundry">Laundry Order</TabsTrigger>
        </TabsList>
        <TabsContent value="restaurantorder">
          <RestaurantOrders />
        </TabsContent>
        <TabsContent value="gym">
          <GymMemberships />
        </TabsContent>
        <TabsContent value="laundry">
          <LaundryOrders />
        </TabsContent>
      </Tabs>
    </div>
  );
}
