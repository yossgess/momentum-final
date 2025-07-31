const Buddy = require("../../../../assets/illustrations/buddy.png");
const Challenge = require("../../../../assets/illustrations/challenge.jpg");
const Events = require("../../../../assets/illustrations/events.jpg");

export interface OnboardingSlide {
  image: any;
  titleKey: string;
  subtitleKey: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    image: Buddy,
    titleKey: "onboarding.title1",
    subtitleKey: "onboarding.subtitle1",
  },
  {
    image: Events,
    titleKey: "onboarding.title2",
    subtitleKey: "onboarding.subtitle2",
  },
  {
    image: Challenge,
    titleKey: "onboarding.title3",
    subtitleKey: "onboarding.subtitle3",
  },
];
