# TEE:UP Layout Guide

This guide outlines the foundational layout principles and structure for the TEE:UP web service, ensuring consistency, responsiveness, and adherence to our "Calm Control" design philosophy. Inspired by Apple Human Interface Guidelines, we prioritize clarity, efficiency, and elegant visual presentation.

---

## 1. Overall Structure

### A. General Principles

*   **Maximum Readability**: Content areas are optimized for readability, with appropriate line lengths and contrast.
*   **Hierarchical & Clear**: Visual hierarchy is established through sizing, spacing, and placement to guide the user's eye naturally.
*   **Responsive by Design**: All layouts are designed mobile-first and adapt seamlessly to larger screens, ensuring a consistent experience across devices.
*   **Minimalist & Uncluttered**: Ample use of white space to create a sense of calm and focus, reducing visual noise.
*   **Consistency**: Repetitive use of layout patterns and components for predictability and ease of learning.

### B. Global Layout (Conceptual)

```
+-------------------------------------------------------------------------+
|                  [Thin Header with Logo & Primary CTA]                  |
+-------------------------------------------------------------------------+
|                                                                         |
|                                [Main Content Area]                      |
|                     (Max-width 1200px, horizontally centered)           |
|                                                                         |
+-------------------------------------------------------------------------+
|                                [Footer]                                 |
+-------------------------------------------------------------------------+
```

### C. Key Elements

*   **Header**:
    *   **Height**: Thin, minimal height to maximize content space.
    *   **Background**: Matches or subtly contrasts with the `tee-background` color, maintaining a calm aesthetic.
    *   **Content**: Logo (left), Primary Call-to-Action (right).
    *   **Mobile**: Hamburger menu for navigation.
    *   **Behavior**: Sticky on scroll for easy access to navigation and CTA.
*   **Main Content Area**:
    *   **Max-Width**: `1200px` for optimal readability and visual balance on large screens.
    *   **Centering**: Always horizontally centered on the page.
    *   **Padding/Margins**: Generous horizontal and vertical padding/margins (`space-4` to `space-16`) to create breathing room.
*   **Footer**:
    *   **Content**: Copyright, links to legal information, possibly social media (minimalist).
    *   **Layout**: Simple, clean, and unobtrusive.
    *   **Background**: `tee-background` or `tee-ink-strong` for clear separation.

---

## 2. Page Sections & Components

### A. Hero Sections (Examples)

**Principle**: No full-bleed hero images. Instead, use a structured "card" style that highlights key information within a contained, elegant space. Inspired by Apple HIG's use of "Large Titles" and concise content blocks.

#### Example 1: Landing Page Hero (Text-focused)

```
+-------------------------------------------------------------------------+
|                     [Vertical Padding: space-16 to space-32]            |
|   +-----------------------------------------------------------------+   |
|   | [Centered Card: max-width 768px, bg-tee-surface, shadow-card]   |   |
|   |                                                                 |   |
|   |       [Subtle Tag: AI Matching, bg-tee-background]              |   |
|   |                                                                 |   |
|   |                 [Large Title: H1, centered]                     |   |
|   |                                                                 |   |
|   |         [Descriptive Paragraph: centered, max-w-prose]          |   |
|   |                                                                 |   |
|   |                     [Primary CTA Button]                        |   |
|   |                                                                 |   |
|   +-----------------------------------------------------------------+   |
|                     [Scroll Indicator (subtle)]                     |   |
+-------------------------------------------------------------------------+
```

#### Example 2: Pro Detail Hero (Image + Info)

```
+-------------------------------------------------------------------------+
|                      [Vertical Padding: space-16]                       |
|   +-----------------------------------------------------------------+   |
|   | [Full-width within main content, bg-tee-surface, shadow-card]   |   |
|   |                                                                 |   |
|   |  +------------+                                                 |   |
|   |  | [Pro Image]|                                                 |   |
|   |  | (Rounded)  |  [Pro Name H1]                                  |   |
|   |  +------------+  [LPGA/PGA Tag]                                 |   |
|   |                  [Location]                                     |   |
|   |                  [Avg Rating (Stars)]                           |   |
|   |                                                                 |   |
|   |  [Short Bio/Hook]                                               |   |
|   |                                                                 |   |
|   |  [Primary Booking CTA] [Secondary Contact CTA]                  |   |
|   |                                                                 |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
```

### B. Content Grids & Cards

**Principle**: Information is often presented in a grid of `Card` components, allowing for easy scanning and comparison. Cards use subtle shadows and generous internal padding.

#### Example: Featured Pros Grid

```
+-------------------------------------------------------------------------+
|                       [Vertical Padding: space-16]                      |
|      [Section Title H2]                                                 |
|      [Intro Paragraph]                                                  |
|                                                                         |
|   +-------------+  +-------------+  +-------------+  +-------------+  |
|   |  [Pro Card] |  |  [Pro Card] |  |  [Pro Card] |  |  [Pro Card] |  |
|   |             |  |             |  |             |  |             |  |
|   +-------------+  +-------------+  +-------------+  +-------------+  |
|                                                                         |
|                [Call to Action: View All Pros Link]                     |
|                                                                         |
+-------------------------------------------------------------------------+
```

### C. Forms & Inputs

**Principle**: Forms are clean, intuitive, and minimize cognitive load. Inputs provide clear feedback.

*   **Structure**: Label above input, optional helper text below, clear error states.
*   **Focus**: Visible focus rings (`ring-tee-accent-primary`) for accessibility.
*   **Spacing**: Vertical spacing between form elements (`space-4` to `space-6`).
*   **Validation**: Real-time feedback for input validation.

---

## 3. Responsive Breakpoints

We adopt a standard set of responsive breakpoints, with mobile-first as the primary design approach.

*   **`sm` (640px)**: Small screens (e.g., larger phones in landscape)
*   **`md` (768px)**: Medium screens (e.g., tablets)
*   **`lg` (1024px)**: Large screens (e.g., small laptops)
*   **`xl` (1280px)**: Extra large screens (e.g., desktops, large laptops)
*   **`2xl` (1536px)**: Very large screens (e.g., large monitors)

This guide serves as a living document to ensure that all visual elements contribute to a unified, premium, and user-friendly experience across the TEE:UP platform.
