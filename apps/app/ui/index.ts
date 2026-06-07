/**
 * ATIMAR React Native UI components.
 * Local to apps/app and built on @/theme/tokens.
 */

export {
  resolveButtonSpec,
  resolveAvailabilitySpec,
  resolveIconBadgeSpec,
  useDisclosure,
  useStepper,
  useToggleSet,
} from "./core";
export type {
  AvailabilityState,
  ButtonSpec,
  ButtonVariant,
  ColorKey,
  CourtCardVariant,
  Disclosure,
  FilterChipVariant,
  IconBadgeSpec,
  IconBadgeTone,
  MapPinVariant,
  ProgressVariant,
  Stepper,
  TintKey,
  ToggleSet,
} from "./core";

export {
  useTheme,
  tokens,
  resolveColor,
  resolveTint,
  textStyle,
} from "./theme";

export {
  Icon,
  Button,
  IconButton,
  Card,
  Divider,
  Avatar,
  Logo,
  ScreenContainer,
} from "./primitives";
export type {
  IconProps,
  ButtonProps,
  IconButtonProps,
  IconButtonTone,
  CardProps,
  DividerProps,
  AvatarProps,
  LogoProps,
  ScreenContainerProps,
} from "./primitives";

export { ScreenTitle, SectionTitle, SectionHeaderRow } from "./typography";
export type {
  ScreenTitleProps,
  SectionTitleProps,
  SectionHeaderRowProps,
} from "./typography";

export { FormInput, SearchBar, ToggleRow, RangeSlider } from "./form";
export type {
  FormInputProps,
  SearchBarProps,
  ToggleRowProps,
  RangeSliderProps,
} from "./form";

export {
  SportChip,
  FilterChip,
  SportTag,
  DayChip,
  IconBadge,
  AvailabilityBadge,
  RatingBadge,
  PriceTag,
} from "./chips";
export type {
  SportChipProps,
  FilterChipProps,
  SportTagProps,
  DayChipProps,
  IconBadgeProps,
  AvailabilityBadgeProps,
  RatingBadgeProps,
  PriceTagProps,
} from "./chips";

export { Header, StepProgress, SocialButton, AuthLayout } from "./navigation";
export type {
  HeaderProps,
  StepProgressProps,
  SocialButtonProps,
  AuthLayoutProps,
} from "./navigation";

export { MapPreview } from "./map";
export type { MapPreviewProps } from "./map";

export {
  CourtHero,
  CourtCard,
  VenueCard,
  BookingCard,
  SportSelectCard,
  TimeOfDayCard,
  OptionRow,
  BenefitRow,
  MenuList,
  ProfileMenuItem,
  DetailStat,
  InfoBanner,
  EmptyState,
  CheckBadge,
} from "./cards";
export type {
  CourtHeroProps,
  CourtCardProps,
  VenueCardProps,
  BookingCardProps,
  SportSelectCardProps,
  TimeOfDayCardProps,
  OptionRowProps,
  BenefitRowProps,
  MenuListProps,
  ProfileMenuItemProps,
  DetailStatProps,
  InfoBannerProps,
  EmptyStateProps,
  CheckBadgeProps,
} from "./cards";
