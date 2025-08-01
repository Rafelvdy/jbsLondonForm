# JBS London Forms - Local Storage Implementation Plan

## Background and Motivation

The user wants to implement local storage functionality for a forms-based application that allows users to create PPM (Planned Preventive Maintenance) surveys and cost estimates. The goal is to enable offline functionality where users can:

1. Fill out building information
2. Add multiple mechanical systems with detailed information
3. Add multiple electrical systems with detailed information  
4. Add multiple compliance and other systems
5. Fill out PPM costing summary
6. Save all data to browser's local storage for offline use
7. Later sync data when internet connection is restored (future phase)

The application needs to work offline after being cached, allowing users to work without an internet connection and save their progress locally.

## Key Challenges and Analysis

### Current Application Architecture Analysis

**Main Page Structure (`src/app/page.tsx`):**
- Single page application with all sections rendered together
- Components: BuildingInformation, MechanicalSystems, ElectricalSystems, ComplianceOtherSystems, PpmCostingSummary
- Has a "Save" button at the bottom, but currently not functional
- No state management currently implemented

**Building Information (`src/components/buildingInformation/buildingInformation.tsx`):**
- Simple form with 6 input fields:
  - Site Name, Address, Surveyed By, Client Contact, Building Type, Building Size
- No state management - inputs are uncontrolled
- Needs to be converted to controlled components for local storage

**System Forms Architecture:**
- Each system type (mechanical, electrical, compliance) has dedicated form pages
- Navigate to separate pages for adding systems: `/mechanical-system-form`, `/electrical-system-form`, `/compliance-other-systems-forms`
- Each form has system selection via combobox and detailed input fields

**Mechanical Systems (`src/app/mechanical-system-form/page.tsx`):**
- System selection from predefined list (Boiler, Chillers/AC, AHUs, etc.)
- When system selected, shows input fields: Quantity, Location, Condition, Manufacturer, Model, Service Interval, Notes
- No save functionality currently - data is lost on navigation

**Electrical Systems (`src/app/electrical-system-form/page.tsx`):**
- Similar structure to mechanical systems
- Different predefined system types (Distribution boards, lighting, power, fire alarm, etc.)
- Same input fields as mechanical systems
- No save functionality currently

**Compliance Systems (`src/app/compliance-other-systems-forms/page.tsx`):**
- System selection from compliance-specific list (Fire alarm certificates, gas safety, EICR, etc.)
- **ISSUE IDENTIFIED:** This form only shows system selection combobox, but missing the input fields that mechanical and electrical forms have

**PPM Costing Summary (`src/components/ppmCostingSummary/ppmCostingSummary.tsx`):**
- Form with 7 fields: Task/Asset, Frequency, Labour Hours, Materials, Subcontract, Total Cost, Notes & Recommendations
- No state management - inputs are uncontrolled

**System Cards (`src/components/ui/systemCard/systemCard.tsx`):**
- Currently just displays a title
- Only mechanical systems page shows a system card
- Electrical and compliance pages don't show system cards
- Need to be enhanced to display added systems dynamically

### Core Technical Challenges

1. **State Management:** No centralized state management exists - need to implement React state or context
2. **Data Persistence:** No local storage implementation exists
3. **Form Data Structure:** Need to define comprehensive data structures for all form types
4. **Navigation State Loss:** Currently when navigating between form pages, data is lost
5. **Incomplete Form Implementation:** Compliance form is missing input fields
6. **System Display:** System cards not dynamically populated with added systems

### Offline Functionality Assessment

**Your offline approach is CORRECT and will work:**
- Caching the application for offline use ✅
- Storing form data in local storage ✅  
- Working without internet connection ✅
- Syncing when connection restored (future) ✅

**Technical Requirements for Offline:**
- Service Worker for caching app files
- Local Storage for form data persistence
- Progressive Web App (PWA) configuration
- Proper state management to handle offline data

## High-level Task Breakdown

### Phase 1: State Management Foundation
- [ ] **Task 1.1:** Implement centralized state management (React Context or Zustand)
  - Success Criteria: All form data managed in centralized state, can access/update from any component
- [ ] **Task 1.2:** Convert all uncontrolled inputs to controlled components
  - Success Criteria: All input values managed by state, changes persist during navigation
- [ ] **Task 1.3:** Define comprehensive data structures for all system types
  - Success Criteria: TypeScript interfaces for BuildingInfo, MechanicalSystem, ElectricalSystem, ComplianceSystem, PPMCostingSummary

### Phase 2: Form Completion and Data Collection  
- [ ] **Task 2.1:** Complete compliance system form (add missing input fields)
  - Success Criteria: Compliance form has same input fields as mechanical/electrical forms
- [ ] **Task 2.2:** Implement system addition functionality
  - Success Criteria: Can add multiple systems of each type, data persists in state
- [ ] **Task 2.3:** Implement system editing/deletion functionality
  - Success Criteria: Can modify or remove added systems

### Phase 3: Local Storage Implementation
- [ ] **Task 3.1:** Implement local storage utilities (save/load/clear)
  - Success Criteria: Can save/load complete form state to/from localStorage
- [ ] **Task 3.2:** Implement auto-save functionality (save on form changes)
  - Success Criteria: Form data automatically saved to localStorage on each change
- [ ] **Task 3.3:** Implement manual save button functionality
  - Success Criteria: "Save" button manually triggers complete form save
- [ ] **Task 3.4:** Implement data restoration on app load
  - Success Criteria: Previously saved data automatically loaded when app starts

### Phase 4: System Display Enhancement
- [ ] **Task 4.1:** Enhance SystemCard component to show system details
  - Success Criteria: SystemCard shows system type, key details, edit/delete buttons
- [ ] **Task 4.2:** Implement dynamic system cards rendering
  - Success Criteria: Added systems appear as cards in their respective sections
- [ ] **Task 4.3:** Add system count indicators
  - Success Criteria: Each section shows count of added systems

### Phase 5: Offline Capabilities (Future Phase)
- [ ] **Task 5.1:** Implement Service Worker for app caching
- [ ] **Task 5.2:** Add PWA manifest and configuration
- [ ] **Task 5.3:** Implement sync functionality for when online
- [ ] **Task 5.4:** Add offline indicators and status

## Project Status Board

### In Progress
- [ ] None currently

### Pending
- [ ] All tasks above in sequential order

### Completed  
- [x] Codebase analysis and planning

## Executor's Feedback or Assistance Requests

*No current requests - awaiting user decision on implementation approach*

## Lessons

### Discovered Issues During Analysis
1. **Incomplete Form Implementation:** Compliance form missing input fields that other system forms have
2. **No State Management:** All inputs are uncontrolled, losing data on navigation
3. **Missing System Display:** Only mechanical systems show system cards, others don't
4. **Non-functional Save Button:** Save button exists but has no functionality

### Technical Recommendations
1. **State Management:** Recommend React Context for this application size (could scale to Zustand if needed)
2. **Local Storage Strategy:** Store complete form state as JSON, implement versioning for future compatibility
3. **Data Structure:** Use consistent interfaces across all system types for easier management
4. **Offline Implementation:** Standard PWA approach with Service Worker will work perfectly for the described use case