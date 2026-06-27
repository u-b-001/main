# Payload CMS Admin Panel Architecture & Functionality Guide

This document provides a detailed, point-by-point architectural breakdown of the administrative functionalities, data flows, access controls, and lifecycle hooks implemented in the DUCC (Department of University Computer Centre) system. It is designed to act as a reference guide and architectural context when porting these functionalities to other projects.

---

## 1. Authentication & Role-Based Access Control (RBAC) Flow

The admin panel employs a strict, field-level and collection-level Role-Based Access Control system to manage user permissions.

### Role Definitions (`src/access/roles.ts`)
Four distinct administrative roles are defined:
* **Super Admin (`super_admin`)**: Complete system control.
* **School Admin (`school_admin`)**: Operational control over pages and user content.
* **Content Editor (`content_editor`)**: Drafts and edits public pages, news, and media.
* **Viewer (`viewer`)**: Basic read-only access (default role).

### Access Control Architecture & Flow
```
[User Login / JWT Request]
           │
           ▼
[Check User Roles array]
           │
 ┌─────────┴─────────┬────────────────────────┬──────────────────────┐
 │                   │                        │                      │
 ▼                   ▼                        ▼                      ▼
[super_admin]   [school_admin]         [content_editor]          [viewer]
 │                   │                        │                      │
 ├─► Full Access     ├─► Manage Pages         ├─► Edit Pages/Media    └─► Read-only
 └─► Edit User Roles └─► Cannot edit Users    └─► Cannot Delete pages     (No admin login)
```

1. **User Collection Restrictions (`src/collections/Users.ts`)**:
   * **Creation/Deletion**: Restricted only to `super_admin`.
   * **Role Modifications**: The `roles` select dropdown field has field-level write restrictions (`adminFieldAccess`), preventing non-super-admins from escalating their own or other users' roles.
   * **Updates**: Users can update their own profiles (`firstName`, `lastName`) via the `adminOrSelf` hook.
2. **Page & Content Permissions**:
   * **Create/Update**: Allowed for `content_editor` and above.
   * **Delete**: Restricted to `school_admin` and above.
   * **Read**: Public users can only read `published` pages. Editors and Admins can read all drafts and previews via the `publishedOrEditor` logic.

---

## 2. Page & Layout Management (Dynamic Blocks System)

The core admin layout editor uses Payload's native `blocks` field to enable a drag-and-drop page builder.

### Flow Architecture
```
[Admin Page Layout Editor]
           │
           ├─► Re-order Blocks (Drag-and-Drop)
           ├─► Populate Block-level schemas (Hero, FeatureCards, CallToAction)
           │
           ▼
     [Save Draft / Publish] ──► [Runs Collection hooks] ──► [Database Schema Sync]
```

* **Dynamic Block Schema (`src/blocks/`)**:
  Blocks are organized as modular configuration files. The main wrapper is `allBlocks` in [allBlocks.ts](file:///c:/Users/Admin/Desktop/payload/DUCC/src/blocks/allBlocks.ts), which imports individual block config schemas. The system currently features a comprehensive suite of blocks:
  - **Layout & Structure**: `FlexibleRow.ts`, `Tabs.ts`
  - **Content & Text**: `RichContent.ts`, `BannerAlert.ts`, `Marquee.ts`
  - **Media & Galleries**: `ImageGallery.ts`, `ScreenshotGallery.ts`, `ContentWithMedia.ts`, `Embed.ts`
  - **Hero & Headers**: `Hero.ts`
  - **Data Display**: `FeatureCards.ts`, `ShowcaseCards.ts`, `Statistics.ts`, `StatesOnboarded.ts`, `GoaSchoolSnapshotBlock.ts`
  - **Interactive & Forms**: `CallToAction.ts`, `FAQ.ts`, `FormLayout.ts`, `InteractiveMap.ts`
  - **Dynamic Content**: `CareerPosting.ts`, `NewsUpdates.ts`, `HelpSupport.ts`, `TeamGrid.ts`, `Testimonials.ts`
* **Admin UX**:
  Administrators can build layouts dynamically, select custom icons, define background layout variables, link attachments, configure progress bars, and link form templates.

---

## 3. Automated Navigation Synchronization Hook

One of the key administrative systems is the synchronization of header menus with the page hierarchy.

### The Lifecycle Hooks (`src/hooks/syncNavItems.ts`)
The `Pages` collection registers `syncNavAfterChange` and `syncNavAfterDelete` collection-level hooks.

```
                  ┌──────────────────────────────┐
                  │ Page Created / Saved / Deleted│
                  └──────────────┬───────────────┘
                                 │
                                 ▼
                     [syncNavToHeader Trigger]
                                 │
            ┌────────────────────┴────────────────────┐
            ▼                                         ▼
   [Fetch Active Pages]                      [Fetch Current Header Global]
 (showInNav: true & published)               (Preserves manual external links,
            │                                 submenus, and hidden settings)
            └────────────────────┬────────────────────┘
                                 │
                                 ▼
                    [Compute Merge & Sanitize]
                                 │
                                 ▼
                     [Update Header Global UI]
```

### Flow Workings:
1. **Detect Changes**: When a page is updated or deleted, the hook runs `syncNavToHeader` in the background (preventing database locks during validates).
2. **Retrieve Current Header state**: It reads the current global `header` layout, parsing the existing link array, custom submenus (`children`), and `navSyncHiddenPageUrls` (pages manually removed from navigation by an admin).
3. **Filter Page vs. Manual Links**: It segments URLs. Manual/external links (e.g. link to a parent university portal) are preserved, while page-specific links are rebuilt based on the page's current `title`, `slug`, and `navOrder`.
4. **Submenu Preservation**: If an admin manually configured custom React submenus (`children`) under a page link, they are sanitized and merged back so structural formatting is not lost.

---

## 4. Software Request Workflow & Cascading Hard Deletes

The system manages user software access requests via the `JobApplications` collection.

### Lifecycle Hook Flow (`src/collections/JobApplications.ts`)
To prevent data leaks and maintain database hygiene, the system implements a cascading delete sequence via the `autoDeleteWhenMarkedDeleted` change hook:

```
[Admin sets Software Request status to 'Delete']
                       │
                       ▼
            [afterChange Hook Trigger]
                       │
                       ▼
          [Fetch Linked Resume Attachment]
                       │
                       ▼
       [Delete Resume record & File from disk]
 (Triggers underlying Media adapter file system cleanup)
                       │
                       ▼
      [Delete Software Request record from DB]
```

### Flow Workings:
1. **Status Trigger**: When a request's `status` field is set to `'deleted'` by an administrator, the hook triggers.
2. **Dependency Deletion**: It identifies the linked attachment ID in the `resumes` upload collection, executes a database deletion on that record (which cleans up physical disk storage using the underlying file adapters), and then permanently deletes the software request record itself.
3. **Orphan Prevention**: This design ensures that no orphaned resume files or sensitive PDF records remain on the local disk.

---

## 5. Globals Control, Homepage Functionalities & Branding Panels

Three admin global configurations reside in `src/globals/` to manage site-wide settings and the homepage functionality:

1. **Site Settings (`SiteSettings.ts`)**:
   * **Homepage Functionality**: Utilizes the custom `HomePageSelectorField` component to allow administrators to dynamically select which page acts as the system's root home page (`/`). This ensures robust routing and default home page redirect values without relying on hardcoded URLs.
   * **Site Identity**: Site Name, favicon uploading, and general meta configurations.
   * **Branding Typography**: Font selectors mapping to Google Fonts (`Space Grotesk`, `Plus Jakarta Sans`, etc.) used site-wide.
   * **Color Presets & Themes**: Theme controllers allowing administrators to customize HSL colors (primary, secondary, background, muted, accent, text, surface).
2. **Header (`Header.ts`)**:
   * Houses the primary navigation configuration arrays, sync states, and logo relationships. It integrates deeply with the automatic navigation synchronization hooks to render dynamic page hierarchies and maintain robust site routing.
3. **Footer (`Footer.ts`)**:
   * Controls multi-column links, copy texts, branding logos, social media integrations, and contact information.

---

## 6. Custom Admin UI Components

To provide a highly customized and user-friendly experience within the Payload admin panel, several bespoke React components are implemented in `src/components/admin/`:

1. **`IconPickerField.tsx`**: Provides administrators with a visual grid and dropdown to select standard icons for blocks (like FeatureCards) instead of typing icon names manually.
2. **`ColorPickerField.tsx`**: A custom color selection interface tailored for the branding and theme settings (used in Globals or Block backgrounds).
3. **`OpacitySliderField.tsx`**: Allows fine-grained visual control over element opacity (e.g., background overlays on Heros).
4. **`HomePageSelectorField.tsx`**: A specialized relation field interface that makes selecting the default homepage intuitive.
5. **`ApplicationsDashboardCard.tsx` & `ApplicationsDashboard/`**: A custom dashboard widget view for administrators to monitor and manage Job Applications and Software Requests directly from the admin dashboard.

---

## 7. How to Port/Reuse These Patterns in Other Projects

When designing or integrating similar administration systems in other Payload CMS projects, copy these patterns as follows:

### Checklist for Porting:
1. **Access Rules**: Copy [roles.ts](file:///c:/Users/Admin/Desktop/payload/DUCC/src/access/roles.ts) and reference the access functions (`editorAccess`, `adminAccess`, `publishedOrEditor`) in the collections' `access` configurations.
2. **Page Blocks**: Ensure your target configuration exports an array of blocks and uses `type: 'blocks'` inside the page schema, mapping component types on the React side using a router pattern similar to `BlockRenderer.tsx`.
3. **Navigation Sync**: Import `syncNavAfterChange` and `syncNavAfterDelete` from [syncNavItems.ts](file:///c:/Users/Admin/Desktop/payload/DUCC/src/hooks/syncNavItems.ts) and register them in your Pages collection hooks, ensuring you have a global with the slug `'header'` containing a `navItems` array.
4. **Cascading Deletes**: Copy the `afterChange` hook from [JobApplications.ts](file:///c:/Users/Admin/Desktop/payload/DUCC/src/collections/JobApplications.ts) to clean up linked media/file uploads when parent records are flagged for deletion.
