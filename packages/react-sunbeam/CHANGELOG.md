# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.3](https://github.com/vovaguguiev/react-sunbeam/compare/v1.0.2...v1.0.3) (2020-11-15)

**Note:** Version bump only for package react-sunbeam





## [1.0.1](https://github.com/vovaguguiev/react-sunbeam/compare/v1.0.0...v1.0.1) (2020-11-01)

**Note:** Version bump only for package react-sunbeam

# [1.0.0](https://github.com/vovaguguiev/react-sunbeam/compare/v0.13.0...v1.0.0) (2020-11-01)

### Features

-   replace unstable_getPreferredChildOnFocusReceive prop with getPreferredChildOnFocus ([d5a1138](https://github.com/vovaguguiev/react-sunbeam/commit/d5a11381e241e26352ee17eddf3a95009919e532))
-   **exports:** add subpaths exports config to package.json ([a812355](https://github.com/vovaguguiev/react-sunbeam/commit/a81235561da2fb58d605509142195b981977ca0f))

### BREAKING CHANGES

-   `unstable_getPreferredChildOnFocusReceive` prop is removed from SunbeamProvider and
    Focusable components, `getPreferredChildOnFocus` is introduced instead

# [0.13.0](https://github.com/vovaguguiev/react-sunbeam/compare/v0.12.1...v0.13.0) (2020-03-27)

### Features

-   **focusable:** add "lock" prop ([2efafdf](https://github.com/vovaguguiev/react-sunbeam/commit/2efafdf7debb5471dcf9d2fc28b041d1a2287468))

## [0.12.1](https://github.com/vovaguguiev/react-sunbeam/compare/v0.12.0...v0.12.1) (2020-03-23)

**Note:** Version bump only for package react-sunbeam

# [0.12.0](https://github.com/vovaguguiev/react-sunbeam/compare/v0.11.1...v0.12.0) (2020-03-22)

### Features

-   add "focusable" prop to Focusable and useFocusable ([43e9a49](https://github.com/vovaguguiev/react-sunbeam/commit/43e9a49320dee817b02d1ddfb486bbd21825bd8a))

## [0.11.1](https://github.com/vovaguguiev/react-sunbeam/compare/v0.11.0...v0.11.1) (2020-03-18)

### Bug Fixes

-   **FocusManager:** setFocus validates and fixes provided path ([0cde7a6](https://github.com/vovaguguiev/react-sunbeam/commit/0cde7a6))

# [0.11.0](https://github.com/vovaguguiev/react-sunbeam/compare/v0.10.1...v0.11.0) (2020-01-04)

### Features

-   **package_json:** add "unpkg" field to package.json ([c09509c](https://github.com/vovaguguiev/react-sunbeam/commit/c09509c))

## [0.10.1](https://github.com/vovaguguiev/react-sunbeam/compare/v0.10.0...v0.10.1) (2020-01-04)

**Note:** Version bump only for package react-sunbeam

# [0.10.0](https://github.com/vovaguguiev/react-sunbeam/compare/v0.9.0...v0.10.0) (2019-11-26)

### Features

-   **spatialnavigation:** when picking candidate among parent siblings take parent box into account ([729fc4c](https://github.com/vovaguguiev/react-sunbeam/commit/729fc4c))

# [0.9.0](https://github.com/vovaguguiev/react-sunbeam/compare/v0.8.0...v0.9.0) (2019-10-12)

### Features

-   **key-press:** add keypress management solution ([1d4d263](https://github.com/vovaguguiev/react-sunbeam/commit/1d4d263))

# [0.8.0](https://github.com/wzrdzl/react-sunbeam/compare/v0.7.0...v0.8.0) (2019-09-08)

### Features

-   **Focusable:** add onFocus and onBlur props ([ff7c208](https://github.com/wzrdzl/react-sunbeam/commit/ff7c208))
-   **KeyPressManager:** add KeyPressManager ([d5c92fb](https://github.com/wzrdzl/react-sunbeam/commit/d5c92fb))

# [0.7.0](https://github.com/wzrdzl/react-sunbeam/compare/v0.6.1...v0.7.0) (2019-08-03)

### Features

-   **useSunbeam:** returns null instead of throwing when there is no SunbeamContext.Provider in the t ([76c25cc](https://github.com/wzrdzl/react-sunbeam/commit/76c25cc))

## [0.6.1](https://github.com/wzrdzl/react-sunbeam/compare/v0.6.0...v0.6.1) (2019-07-01)

### Bug Fixes

-   properly update focus after changes to the focusable tree ([eb332e2](https://github.com/wzrdzl/react-sunbeam/commit/eb332e2))

# [0.6.0](https://github.com/wzrdzl/react-sunbeam/compare/v0.5.0...v0.6.0) (2019-06-03)

### Features

-   **SunbeanProvider:** add optional "onFocusUpdate" prop ([0b98d7c](https://github.com/wzrdzl/react-sunbeam/commit/0b98d7c))

# [0.5.0](https://github.com/wzrdzl/react-sunbeam/compare/v0.4.0...v0.5.0) (2019-05-23)

### Features

-   **types:** export FocusableTreeNode and Direction types ([9e2766e](https://github.com/wzrdzl/react-sunbeam/commit/9e2766e))

# [0.4.0](https://github.com/wzrdzl/react-sunbeam/compare/v0.3.2...v0.4.0) (2019-05-23)

### Features

-   add experimental "unstable_getPreferredChildOnFocusReceive" prop API ([a796e7c](https://github.com/wzrdzl/react-sunbeam/commit/a796e7c))

## [0.3.2](https://github.com/wzrdzl/react-sunbeam/compare/v0.3.1...v0.3.2) (2019-05-04)

### Bug Fixes

-   graceful handling the unmount of a focused Focusable ([629f972](https://github.com/wzrdzl/react-sunbeam/commit/629f972))

## [0.3.1](https://github.com/wzrdzl/react-sunbeam/compare/v0.3.0...v0.3.1) (2019-05-01)

**Note:** Version bump only for package react-sunbeam
