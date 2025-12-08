"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const page = () => {
  const [value, setValue] = useState("");
  const trpc = useTRPC();

  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        toast.success("Inngest event for background job sent!");
      },
    })
  );
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input
        className="max-w-3xl"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        className="rounded-none"
        disabled={createMessage.isPending}
        variant="outline"
        onClick={() => {
          createMessage.mutate({ value: value });
          setValue("");
        }}
      >
        Send Inngest Event
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
};

export default page;
