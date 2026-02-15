import type { MathMetadata } from '../types';

export const MATH_METADATA: MathMetadata = {
    subjects: {
        "수학 I": {
            majorChapters: {
                1: {
                    name: "지수함수와 로그함수",
                    minorChapters: {
                        1: {
                            name: "지수",
                            questionTypes: {
                                1: "거듭제곱과 거듭제곱근",
                                2: "지수의 확장",
                                3: "지수법칙의 응용"
                            }
                        },
                        2: {
                            name: "로그",
                            questionTypes: {
                                1: "로그의 뜻과 성질",
                                2: "상용로그",
                                3: "로그의 연산"
                            }
                        }
                    }
                },
                2: {
                    name: "삼각함수",
                    minorChapters: {
                        1: {
                            name: "삼각함수",
                            questionTypes: {
                                1: "일반각과 호도법",
                                2: "삼각함수의 정의",
                                3: "삼각함수의 그래프"
                            }
                        }
                    }
                }
            }
        },
        "수학 II": {
            majorChapters: {
                1: {
                    name: "함수의 극한과 연속",
                    minorChapters: {
                        1: {
                            name: "함수의 극한",
                            questionTypes: {
                                1: "함수의 극한",
                                2: "극한값의 계산"
                            }
                        }
                    }
                }
            }
        }
    }
};
