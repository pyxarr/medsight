import { TextInput } from "react-native";
import { cn } from "@/lib/utils";

function Input({
  className,
  placeholderTextColor = "#9ca3af",
  selectionColor = "#1d4ed8",
  cursorColor = "#1d4ed8",
  style,
  ...props
}: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor={placeholderTextColor}
      selectionColor={selectionColor}
      cursorColor={cursorColor}
      style={[{ height: 52, color: "#111827" }, style]}
      className={cn(
        "w-full rounded-[18px] border border-gray-300 bg-white px-4 text-base",
        props.editable === false && "opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };