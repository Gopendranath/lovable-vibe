"use client";

import { useCurrentTheme } from "@/hooks/use-current-theme";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const UserControll = () => {
  const currentTheme = useCurrentTheme();

  return (
    <UserButton
      showName={true}
      appearance={{
        elements: {
          userButtonBox: "rounded-md!",
          userButtonAvatarBox: "rounded-md! size-8!",
          userButtonTrigger: "rounded!",
        },
        baseTheme: currentTheme === "dark" ? dark : undefined
      }}
    />
  );
};
