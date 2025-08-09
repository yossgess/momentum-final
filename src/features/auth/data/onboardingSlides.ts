const Buddy = require("../../../../assets/illustrations/buddy1.png");
const Challenge = require("../../../../assets/illustrations/challenge1.png");
const Events = require("../../../../assets/illustrations/events1.png");

export interface OnboardingSlide {
  image: any;
  titleKey: string;
  subtitleKey: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    image: Challenge,
    titleKey: "onboarding.title1",
    subtitleKey: "onboarding.subtitle1",
  },
  {
    image: Events,
    titleKey: "onboarding.title2",
    subtitleKey: "onboarding.subtitle2",
  },
  {
    image: Buddy,
    titleKey: "onboarding.title3",
    subtitleKey: "onboarding.subtitle3",
  },
];
