import { Ref, watch } from 'vue';

export function useExpandableAnimation(isExpanded: Ref<boolean>, expandableContent: Ref<HTMLElement | null>) {
  watch(isExpanded, (newValue) => {
    if (expandableContent.value) {
      if (newValue) {
        // 1. Set explicit pixel height to start the CSS transition
        expandableContent.value.style.height = expandableContent.value.scrollHeight + "px";

        // 2. After transition (300ms), set to 'auto' to adapt to dynamic content changes
        setTimeout(() => {
          if (expandableContent.value && isExpanded.value) {
            expandableContent.value.style.height = "auto";
          }
        }, 250);
      } else {
        // 1. If currently 'auto', lock it to pixels so we can transition from it
        if (expandableContent.value.style.height === "auto") {
          expandableContent.value.style.height = expandableContent.value.scrollHeight + "px";
          // Force reflow so the browser registers the pixel height before setting to 0
          void expandableContent.value.offsetHeight;
        }
        // 2. Animate to 0
        expandableContent.value.style.height = "0px";
      }
    }
  });
}

