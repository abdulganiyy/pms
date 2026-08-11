"use client";
import RatePlans from "@/components/rateplan/RatePlans";
import { Rooms } from "@/components/room/Rooms";
import { RoomRates } from "@/components/roomrate/RoomRates";
import { RoomTypes } from "@/components/roomtype/RoomTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RoomPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#1F384C] text-lg leading-5.75">Room Management</h2>
      <Tabs defaultValue="room-type">
        <TabsList variant="line">
          <TabsTrigger value="room-type">Room Type</TabsTrigger>
          <TabsTrigger value="rate-plan">Rate Plan</TabsTrigger>
          <TabsTrigger value="room-rate">Room Rate</TabsTrigger>
          <TabsTrigger value="room">Room</TabsTrigger>
        </TabsList>
        <TabsContent value="room-type">
          <RoomTypes />
        </TabsContent>
        <TabsContent value="rate-plan">
          <RatePlans />
        </TabsContent>
        <TabsContent value="room-rate">
          <RoomRates />
        </TabsContent>
        <TabsContent value="room">
          <Rooms />
        </TabsContent>
      </Tabs>
    </div>
  );
}
