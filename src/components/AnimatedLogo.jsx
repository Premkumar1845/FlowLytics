export default function AnimatedLogo({ size = 36 }) {
    return (
        <div className="relative group" style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 100 100"
                width={size}
                height={size}
                className="overflow-visible"
            >
                <defs>
                    {/* Gradient for the main shape */}
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="50%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>

                    {/* Glow gradient */}
                    <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </radialGradient>

                    {/* Wave gradient */}
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a5b4fc" />
                        <stop offset="50%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#c7d2fe" />
                    </linearGradient>

                    {/* Clip for rounded square */}
                    <clipPath id="roundedClip">
                        <rect x="4" y="4" width="92" height="92" rx="22" />
                    </clipPath>
                </defs>

                {/* Subtle glow behind - pulses */}
                <circle cx="50" cy="50" r="48" fill="url(#glowGrad)">
                    <animate
                        attributeName="r"
                        values="44;48;44"
                        dur="3s"
                        repeatCount="indefinite"
                        keyTimes="0;0.5;1"
                        calcMode="spline"
                        keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                    />
                    <animate
                        attributeName="opacity"
                        values="0.5;0.8;0.5"
                        dur="3s"
                        repeatCount="indefinite"
                    />
                </circle>

                {/* Main rounded square */}
                <rect
                    x="4" y="4" width="92" height="92" rx="22"
                    fill="url(#logoGrad)"
                />

                {/* Animated shimmer overlay */}
                <g clipPath="url(#roundedClip)">
                    <rect x="-100" y="0" width="60" height="100" fill="white" opacity="0.07" transform="skewX(-20)">
                        <animate
                            attributeName="x"
                            values="-100;200"
                            dur="4s"
                            repeatCount="indefinite"
                            keyTimes="0;1"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1"
                        />
                    </rect>
                </g>

                {/* Flow wave line 1 - main */}
                <path
                    d="M 20 58 Q 35 38, 50 50 T 80 42"
                    fill="none"
                    stroke="url(#waveGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    opacity="0.9"
                >
                    <animate
                        attributeName="d"
                        values="M 20 58 Q 35 38, 50 50 T 80 42;M 20 52 Q 35 62, 50 48 T 80 38;M 20 58 Q 35 38, 50 50 T 80 42"
                        dur="4s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                    />
                </path>

                {/* Flow wave line 2 - secondary */}
                <path
                    d="M 20 68 Q 35 52, 50 60 T 80 54"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.4"
                >
                    <animate
                        attributeName="d"
                        values="M 20 68 Q 35 52, 50 60 T 80 54;M 20 62 Q 35 72, 50 56 T 80 48;M 20 68 Q 35 52, 50 60 T 80 54"
                        dur="4s"
                        repeatCount="indefinite"
                        calcMode="spline"
                        keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        begin="0.5s"
                    />
                </path>

                {/* Bar chart bars - rising animation */}
                <g opacity="0.85">
                    {/* Bar 1 */}
                    <rect x="24" y="70" width="6" rx="1.5" fill="white" opacity="0.7">
                        <animate
                            attributeName="y"
                            values="70;56;70"
                            dur="3s"
                            repeatCount="indefinite"
                            begin="0s"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                        <animate
                            attributeName="height"
                            values="8;22;8"
                            dur="3s"
                            repeatCount="indefinite"
                            begin="0s"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                    </rect>

                    {/* Bar 2 */}
                    <rect x="35" y="62" width="6" rx="1.5" fill="white" opacity="0.8">
                        <animate
                            attributeName="y"
                            values="62;48;62"
                            dur="3s"
                            repeatCount="indefinite"
                            begin="0.3s"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                        <animate
                            attributeName="height"
                            values="16;30;16"
                            dur="3s"
                            repeatCount="indefinite"
                            begin="0.3s"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                    </rect>

                    {/* Bar 3 */}
                    <rect x="46" y="54" width="6" rx="1.5" fill="white" opacity="0.9">
                        <animate
                            attributeName="y"
                            values="54;42;54"
                            dur="3s"
                            repeatCount="indefinite"
                            begin="0.6s"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                        <animate
                            attributeName="height"
                            values="24;36;24"
                            dur="3s"
                            repeatCount="indefinite"
                            begin="0.6s"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                    </rect>

                    {/* Bar 4 - tallest */}
                    <rect x="57" y="46" width="6" rx="1.5" fill="white">
                        <animate
                            attributeName="y"
                            values="46;32;46"
                            dur="3s"
                            repeatCount="indefinite"
                            begin="0.9s"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                        <animate
                            attributeName="height"
                            values="32;46;32"
                            dur="3s"
                            repeatCount="indefinite"
                            begin="0.9s"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                    </rect>

                    {/* Bar 5 */}
                    <rect x="68" y="50" width="6" rx="1.5" fill="white" opacity="0.85">
                        <animate
                            attributeName="y"
                            values="50;38;50"
                            dur="3s"
                            repeatCount="indefinite"
                            begin="1.2s"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                        <animate
                            attributeName="height"
                            values="28;40;28"
                            dur="3s"
                            repeatCount="indefinite"
                            begin="1.2s"
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                    </rect>
                </g>

                {/* Floating dot particle 1 */}
                <circle r="2" fill="white" opacity="0.6">
                    <animate attributeName="cx" values="30;70;30" dur="5s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="35;25;35" dur="5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0;0.7;0" dur="5s" repeatCount="indefinite" />
                </circle>

                {/* Floating dot particle 2 */}
                <circle r="1.5" fill="white" opacity="0.5">
                    <animate attributeName="cx" values="60;40;60" dur="4s" repeatCount="indefinite" begin="1s" />
                    <animate attributeName="cy" values="30;20;30" dur="4s" repeatCount="indefinite" begin="1s" />
                    <animate attributeName="opacity" values="0;0.6;0" dur="4s" repeatCount="indefinite" begin="1s" />
                </circle>

                {/* Floating dot particle 3 */}
                <circle r="1.8" fill="#c7d2fe" opacity="0.4">
                    <animate attributeName="cx" values="75;50;75" dur="6s" repeatCount="indefinite" begin="2s" />
                    <animate attributeName="cy" values="40;28;40" dur="6s" repeatCount="indefinite" begin="2s" />
                    <animate attributeName="opacity" values="0;0.5;0" dur="6s" repeatCount="indefinite" begin="2s" />
                </circle>
            </svg>
        </div>
    );
}
