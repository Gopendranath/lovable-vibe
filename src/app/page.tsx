"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const page = () => {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Inngest event for background job sent!");
    }
  }));
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Button className="rounded-none" disabled={invoke.isPending} variant="outline" onClick={() => invoke.mutate({ text: "John" })}>
        Send Inngest Event
      </Button>
    </div>
  );
};

export default page;
