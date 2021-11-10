

const originalPlatform = navigator.platform;
let mockedPlatform;
Object.defineProperty(navigator, 'platform', {
    get() {
        return mockedPlatform ?? originalPlatform;
    },
});

export function mockPlatform(platform) {
    mockedPlatform = platform;
}

export function clearMockPlatform() {
    mockedPlatform = undefined;
}
