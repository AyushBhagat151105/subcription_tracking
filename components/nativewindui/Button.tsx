import * as Slot from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  Platform,
  Pressable,
  PressableProps,
  View,
  ViewStyle,
} from "react-native";

import { TextClassContext } from "../../components/nativewindui/Text";
import { cn } from "../../lib/utils";
import { useColorScheme } from "~/lib/useColorScheme";
import { COLORS } from "../../theme/colors";

const buttonVariants = cva("flex-row items-center justify-center gap-2", {
  variants: {
    variant: {
      primary: "ios:active:opacity-80 bg-primary",
      secondary:
        "ios:border-primary ios:active:bg-primary/5 border border-foreground/40",
      tonal:
        "ios:bg-primary/10 dark:ios:bg-primary/10 ios:active:bg-primary/15 bg-primary/15 dark:bg-primary/30",
      plain: "ios:active:opacity-70",
    },
    size: {
      none: "",
      sm: "py-1 px-2.5 rounded-full",
      md: "ios:rounded-lg py-2 ios:py-1.5 ios:px-3.5 px-5 rounded-full",
      lg: "py-2.5 px-5 ios:py-2 rounded-xl gap-2",
      icon: "ios:rounded-lg h-10 w-10 rounded-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

const androidRootVariants = cva("overflow-hidden", {
  variants: {
    size: {
      none: "",
      icon: "rounded-full",
      sm: "rounded-full",
      md: "rounded-full",
      lg: "rounded-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const buttonTextVariants = cva("font-medium", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "ios:text-primary text-foreground",
      tonal: "ios:text-primary text-foreground",
      plain: "text-foreground",
    },
    size: {
      none: "",
      icon: "",
      sm: "text-[15px] leading-5",
      md: "text-[17px] leading-7",
      lg: "text-[17px] leading-7",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

function convertToRGBA(rgb: string, opacity: number): string {
  const rgbValues = rgb.match(/\d+/g);
  if (!rgbValues || rgbValues.length !== 3) {
    throw new Error("Invalid RGB color format");
  }
  const red = parseInt(rgbValues[0], 10);
  const green = parseInt(rgbValues[1], 10);
  const blue = parseInt(rgbValues[2], 10);
  if (opacity < 0 || opacity > 1) {
    throw new Error("Opacity must be a number between 0 and 1");
  }
  return `rgba(${red},${green},${blue},${opacity})`;
}

const ANDROID_RIPPLE = {
  dark: {
    primary: {
      color: convertToRGBA(COLORS.dark.grey3, 0.4),
      borderless: false,
    },
    secondary: {
      color: convertToRGBA(COLORS.dark.grey5, 0.8),
      borderless: false,
    },
    plain: { color: convertToRGBA(COLORS.dark.grey5, 0.8), borderless: false },
    tonal: { color: convertToRGBA(COLORS.dark.grey5, 0.8), borderless: false },
  },
  light: {
    primary: {
      color: convertToRGBA(COLORS.light.grey4, 0.4),
      borderless: false,
    },
    secondary: {
      color: convertToRGBA(COLORS.light.grey5, 0.4),
      borderless: false,
    },
    plain: { color: convertToRGBA(COLORS.light.grey5, 0.4), borderless: false },
    tonal: { color: convertToRGBA(COLORS.light.grey6, 0.4), borderless: false },
  },
};

// Add as class when possible: https://github.com/marklawlor/nativewind/issues/522
const BORDER_CURVE: ViewStyle = {
  borderCurve: "continuous",
};

type ButtonVariantProps = Omit<
  VariantProps<typeof buttonVariants>,
  "variant"
> & {
  variant?: Exclude<VariantProps<typeof buttonVariants>["variant"], null>;
};

type AndroidOnlyButtonProps = {
  /**
   * ANDROID ONLY: The class name of root responsible for hidding the ripple overflow.
   */
  androidRootClassName?: string;
};

type ButtonProps = PressableProps & ButtonVariantProps & AndroidOnlyButtonProps;

const Root = Platform.OS === "android" ? View : Slot.Pressable;

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      className,
      variant = "primary",
      size,
      style = BORDER_CURVE,
      androidRootClassName,
      ...props
    },
    ref
  ) => {
    const { colorScheme } = useColorScheme();

    return (
      <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
        <Root
          className={Platform.select({
            ios: undefined,
            default: androidRootVariants({
              size,
              className: androidRootClassName,
            }),
          })}
        >
          <Pressable
            className={cn(
              props.disabled && "opacity-50",
              buttonVariants({ variant, size, className })
            )}
            ref={ref}
            style={style}
            android_ripple={ANDROID_RIPPLE[colorScheme][variant]}
            {...props}
          />
        </Root>
      </TextClassContext.Provider>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
