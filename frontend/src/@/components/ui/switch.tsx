import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Thay đổi màu nền khi bật và tắt
        "peer data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700",
        // Các class gốc để giữ nguyên kích thước và hiệu ứng
        "inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Luôn giữ thumb màu trắng và điều chỉnh vị trí
          "pointer-events-none block size-3.5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
