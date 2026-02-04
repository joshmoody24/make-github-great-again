// Paste this into browser console on a GitHub Actions failed job page
// to detect what elements are being scrolled into view

const originalScrollIntoView = Element.prototype.scrollIntoView;

Element.prototype.scrollIntoView = function (...args) {
  console.group("scrollIntoView detected");
  console.log("Element:", this);
  console.log("Tag:", this.tagName);
  console.log("ID:", this.id);
  console.log("Classes:", this.className);
  console.log("Text preview:", this.textContent?.slice(0, 100));
  console.log("Parent classes:", this.parentElement?.className);
  console.log("Closest section:", this.closest("section")?.className);
  console.log("Closest div with class:", this.closest("div[class]")?.className);
  console.log("Args:", args);
  console.trace("Call stack");
  console.groupEnd();

  return originalScrollIntoView.apply(this, args);
};

console.log("scrollIntoView monitoring active - refresh page to trigger auto-scroll");
