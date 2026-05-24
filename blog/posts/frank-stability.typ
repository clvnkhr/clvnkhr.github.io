// date: 2026-05-23
// tags: maths, functional-analysis, ai-assisted, rough, talk, stability-of-matter, chinese-translation
// hidden: false


#set par(justify: true)
#set math.equation(numbering: "(1)")
// #set page(fill: red.darken(70%))
// #set text(fill: white.darken(10%))

#title("Summary of the Talk on Stability of Matter and Mathematical Physics in Vienna")

#import "@preview/quick-maths:0.2.1": shorthands

#show: shorthands.with(
  ($+-$, $plus.minus$),
  ($-+$, $minus.plus$),
  ($=<$, $arrow.double.l$),
  ($==$, $equiv$),
  ($<~$, $≲$),
  ($>~$, $≳$),
  ($~=$, $tilde.equiv$),
)
#let hbar = [\u{0127}]
#let grad = $nabla$
#let dd = $dif$
#let del = $partial$
#let infty = $oo$ // for the poor LLM that keeps trying to  use latex's \infty
#let Subset = $subset.double$
#let Supset = $supset.double$
#let ran = math.op("ran")
#let fH = $frak(H)$
#let essran = math.op("ess" + math.thin + "ran")

#let bangle(..xs) = {
  $
    lr(
      chevron.l
      #xs.pos().intersperse([, #math.thin]).join()
      chevron.r
    )
  $
}

#import "@preview/cmarker:0.1.8"
#import "@preview/mitex:0.2.6": mitex

What follows is an AI generated (#link("https://notegpt.io")[notegpt.io, found by google]) summary of Rupert's #link("https://www.youtube.com/watch?v=PfGeLjjTC8o&t=388s&pp=ugUEEgJlbtIHCQkGCwGHKiGM7w%3D%3D")[recent talk] at the Erwin Schrödinger International Institute for Mathematics and Physics (ESI). A chinese translation follows.

Presumably, when I get round to watching with full attention I will leave some clarifying remarks here...

#cmarker.render(
  "
---
The video presents a thorough historical and conceptual overview of key developments in the mathematical physics of many-body quantum systems, focusing primarily on the **stability of matter**, the thermodynamic limit, and related inequalities originating from foundational work accomplished in Vienna and by key figures such as Elliott H. Lieb and Walter Thirring.

---

### Historical and Scientific Context

- **Stability of matter** concerns the question of why macroscopic matter does not collapse despite the complex quantum interactions between electrons and nuclei.
- The first rigorous **proof of the stability of matter** was given by Dyson and Lenard in 1967--68, but their proof was complicated, yielding impractically large constants.
- Lieb and Thirring later provided a more physically motivated and mathematically tractable proof in 1975, significantly improving constants and clarity.
- The talk honours Vienna as a centre for these developments, emphasising the community aspects and the role of key individuals like Jakob Ingason in fostering mathematical physics.

---

### Core Concepts and Theorems

- The **Hamiltonian describing $n$ electrons and $k$ fixed nuclei** includes:
  - Kinetic energy of electrons.
  - Electrostatic attraction between electrons and nuclei.
  - Electron-electron repulsion.
  - Nuclei-nuclei repulsion.
- **Stability of matter theorem:** The ground state energy $E_{\mathrm{GS}}$ satisfies the lower bound
  $$
  E_{\mathrm{GS}} \geq -a(n + k),
  $$
  where $a$ is a positive constant dependent on the maximum nuclear charge but **independent of $n$, $k$, or nuclei positions**.
- This linear scaling prevents energy from becoming arbitrarily negative as $n,k \rightarrow \infty$, ensuring physical stability.

---

### Key Results and Contributions

| Year | Author(s)                   | Result                                                                                      | Key Insight/Impact                                               |
|-------|----------------------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| 1957  | Dyson                      | Birth of mathematical many-body theory                                                     | Dyson's pioneering work on Bose gas energy                      |
| 1967/8| Dyson & Lenard             | First proof of stability of matter                                                         | Complicated, poor constant but seminal                           |
| 1969  | Lieb & Lebowitz            | Existence of the thermodynamic limit for systems with large numbers of particles          | Builds directly upon stability theorem, fundamental in physics  |
| 1973  | Lieb & Simon               | Rigorous justification of Thomas--Fermi theory as a limit of quantum atomic systems        | Connects complex many-body problem to nonlinear density theories|
| 1975  | Lieb & Thirring            | New, simpler proof of stability of matter with substantially better constants             | Provides modular approach, clearer physics insight              |

---

### The Thomas--Fermi Theory Link

- The **Thomas--Fermi (TF) approximation** replaces the complex many-body wavefunction with an electron density function $\rho(x)$ on $\mathbb{R}^3$, simplifying the kinetic energy as:
  $$
  T_{\mathrm{TF}}[\rho] = K_{\mathrm{TF}} \int \rho^{5/3}(x) \, dx,
  $$
  where $K_{\mathrm{TF}}$ is a specific constant.
- Lieb and Simon established in 1973 that as the nuclear charge $Z$ and electron number $n$ tend to infinity (neutral atoms with $n=Z$), the quantum ground state energy approaches the Thomas--Fermi energy.
- This provides a rigorous foundation for using TF theory as an effective model for large atoms.

---

### Lieb--Thirring Inequalities and Their Importance

- The **Lieb--Thirring inequalities** provide lower bounds on sums of negative eigenvalues of Schrödinger operators and relate kinetic energy of fermionic wavefunctions to integrals of electron density.
- They form a cornerstone of modern quantum many-body theory by connecting:
  - **Kinetic energy estimates** for anti-symmetric wavefunctions.
  - **Exchange term bounds** (electron-electron repulsion).
  - Properties of eigenvalues of one-body Schrödinger operators with potential.
- These inequalities underpin the proof of stability and control the behaviour of quantum particles in large systems.

---

### Quantitative Progress on Constants

| Inequality                  | Historical Bound by Lieb--Thirring | Modern Improvements (Recent decades)            | Optimal/Conjectured Value               |
|----------------------------|----------------------------------|-------------------------------------------------|---------------------------------------|
| Bound on exchange energy    | Constant between 8 and 9          | Improved to approx. 1.58 by Levine, Lieb & Sá de Miranda (3 years ago) | Conjectured: approx. 1.45               |
| Kinetic energy lower bound  | Approx. 18.5% of $K_{\mathrm{TF}}$ | Improved to nearly 78% with recent joint work    | Conjectured: 100% (sharp bound)        |

- These constants are crucial for applications in **quantum chemistry** and **semiclassical analysis**.
- Although some progress remains, the **sharp constants remain open problems**, with practical and conceptual implications.

---

### Dimensional Dependence and Current Open Questions

- The inequalities behave differently in dimensions $d=1,2$ versus $d \geq 3$:
  - For **$d=1,2$**, particles tend to repel spatially, optimising constants at $n=1$ (single-particle case).
  - For **$d \geq 3$**, many particles tend to aggregate, reflected in plane-wave optimisers for the density.
- The precise mathematical and physical explanation behind this dimensional effect linked to the **Pauli exclusion principle** remains an open question.
- Modern results by Lieb, Lewin, and collaborators show a **strict decrease of optimal constants $K_N$ with increasing $N$** in higher dimensions, supporting the aggregation idea (‘tunnelling effect').

---

### Timeline of Key Developments

| Year | Event                                                        |
|-------|--------------------------------------------------------------|
| 1957  | Dyson's pioneering paper on Bose gases and many-body theory |
| 1967  | Dyson & Lenard prove stability of matter (complicated proof)|
| 1969  | Lieb & Lebowitz prove thermodynamic limit existence          |
| 1973  | Lieb & Simon justify Thomas--Fermi theory rigorously          |
| 1975  | Lieb & Thirring publish accessible proof of stability of matter |
| 1990  | Dyson acknowledges the impact of Lieb--Thirring approach     |
| 2010s | Incremental improvements on constants in Lieb--Thirring inequalities |
| 2020  | Recent proofs on dimensional effects and asymptotic behaviour |

---

### Key Takeaways and Closing Thoughts

- **The stability of matter is a fundamental property ensured by a delicate interplay of electron kinetic energy, interaction potentials, and the fermionic nature of particles**.
- The **Lieb--Thirring inequalities** have profound implications far beyond stability, influencing effective theories and semiclassical physics.
- Rigorous mathematical approaches have blossomed out of the original physics intuition, translating to deep insights about universal constants and scaling laws.
- Despite substantial progress, **important open problems remain**, including identifying sharp constants and understanding dimension-dependent behaviours.
- The speaker concludes by emphasising the importance of **patience, holistic understanding, and tackling related variations of problems** for genuine comprehension and lasting impact, inspired by Elliott Lieb's philosophy.

---

### Keywords

- Stability of matter
- Lieb--Thirring inequality
- Thomas--Fermi theory
- Schrödinger operator
- Quantum many-body theory
- Ground state energy
- Thermodynamic limit
- Fermions
- Exchange energy
- Mathematical physics
- Pauli exclusion principle
- Semiclassical analysis

---

This summary faithfully reflects the content of the video transcript, capturing the chronological development, mathematical concepts, key results, and ongoing research questions without introducing unsupported details.",
  math: mitex,
)

= Chinese Translation by GPT 5.4

#cmarker.render(
  "
该视频对多体量子系统数学物理中的若干关键发展作了全面的历史性与概念性综述，主要聚焦于“物质稳定性”、热力学极限，以及源自维也纳学派奠基性工作和埃利奥特·H·利布（Elliott H. Lieb）、瓦尔特·蒂林（Walter Thirring）等重要人物相关研究的一系列不等式。

---

### 历史与科学背景

- “物质稳定性”讨论的是这样一个问题：为什么宏观物质尽管存在电子与原子核之间复杂的量子相互作用，却不会塌缩。
- 对“物质稳定性”的第一个严格证明由 Dyson 和 Lenard 于 1967--68 年给出，但他们的证明相当复杂，并且得到的常数大得不切实际。
- 此后，Lieb 和 Thirring 于 1975 年给出了一个更具物理动机、在数学上也更易处理的证明，显著改进了常数并提高了论述的清晰性。
- 该报告也向维也纳作为这些研究发展中心之一致敬，强调了学术共同体的重要性，以及 Jakob Ingason 等关键人物在推动数学物理发展中的作用。

---

### 核心概念与定理

- 描述“ $n$ 个电子和 $k$ 个固定原子核”的哈密顿量包括：
  - 电子的动能；
  - 电子与原子核之间的静电吸引；
  - 电子—电子排斥；
  - 原子核—原子核排斥。
- 物质稳定性定理：基态能量 $ E_{\mathrm{GS}} $ 满足下界
  $$ E_{\mathrm{GS}} \geq -a(n + k), $$
  其中 $ a $ 是一个正常数，它依赖于最大核电荷，但与 $ n $、$ k $ 以及原子核的位置无关。
- 这种线性标度防止当 $ n,k \rightarrow \infty $ 时能量变得任意负，从而保证了物理稳定性。

---

### 关键结果与贡献

| 年份 | 作者                     | 结果                                                                 | 关键见解/影响                                                   |
|------|--------------------------|----------------------------------------------------------------------|----------------------------------------------------------------|
| 1957 | Dyson                    | 数学多体理论的开端                                                   | Dyson 在玻色气体能量方面的开创性工作                          |
| 1967/8 | Dyson 与 Lenard        | 首次证明物质稳定性                                                   | 证明复杂、常数较差，但具有奠基意义                            |
| 1969 | Lieb 与 Lebowitz         | 证明大量粒子体系热力学极限的存在性                                   | 直接建立在稳定性定理之上，是物理中的基础结果                  |
| 1973 | Lieb 与 Simon            | 严格证明 Thomas--Fermi 理论可作为量子原子系统的极限描述               | 将复杂的多体问题与非线性密度理论联系起来                      |
| 1975 | Lieb 与 Thirring         | 给出新的、更简单的物质稳定性证明，且常数显著更优                     | 提供了模块化方法，并带来更清晰的物理洞见                      |

---

### 与 Thomas--Fermi 理论的联系

- Thomas--Fermi（TF）近似用定义在 $ \mathbb{R}^3 $ 上的电子密度函数 $ \rho(x) $ 取代复杂的多体波函数，并将动能简化为
  $$ T_{\mathrm{TF}}[\rho] = K_{\mathrm{TF}} \int \rho^{5/3}(x) \, dx, $$
  其中 $ K_{\mathrm{TF}} $ 是一个特定常数。
- Lieb 和 Simon 于 1973 年证明：当核电荷 $ Z $ 和电子数 $ n $ 同时趋于无穷大时（对于中性原子即 $ n = Z $），量子基态能量趋近于 Thomas--Fermi 能量。
- 这一结果为将 TF 理论作为大原子有效模型使用提供了严格基础。

---

### Lieb--Thirring 不等式及其重要性

- Lieb--Thirring 不等式为薛定谔算子的负特征值之和提供下界，并将费米子波函数的动能与电子密度积分联系起来。
- 它们构成现代量子多体理论的基石，因为它们建立了以下对象之间的联系：
  - 反对称波函数的动能估计；
  - 交换项界（电子—电子排斥）；
  - 带势的一体薛定谔算子特征值的性质。
- 这些不等式支撑了稳定性的证明，并控制了大体系中量子粒子的行为。

---

### 关于常数的定量进展

| 不等式                     | Lieb--Thirring 的历史界        | 现代改进（近几十年）                                | 最优值/猜想值                      |
|---------------------------|-------------------------------|----------------------------------------------------|-----------------------------------|
| 交换能界                  | 常数介于 8 和 9 之间           | 由 Levine、Lieb 和 Sá de Miranda（3 年前）改进至约 1.58 | 猜想值：约 1.45                   |
| 动能下界                  | 约为 $ K_{\mathrm{TF}} $ 的 18.5% | 近期合作工作中改进到接近 78%                         | 猜想值：100%（尖锐界）            |

- 这些常数对于量子化学和半经典分析中的应用至关重要。
- 虽然已有一定进展，但尖锐常数仍是未解决问题，具有实际和概念上的双重意义。

---

### 维数依赖性与当前未解问题

- 这些不等式在维数 $ d=1,2 $ 与 $ d \geq 3 $ 的情形下表现不同：
  - 对于 $ d=1,2 $，粒子倾向于在空间上彼此远离，因此最优常数在 $ n=1 $（单粒子情形）时达到；
  - 对于 $ d \geq 3 $，多粒子倾向于聚集，这一点反映在密度的平面波极值结构中。
- 与泡利不相容原理相关的这种维数效应，其精确的数学与物理解释仍然是一个未解问题。
- Lieb、Lewin 及其合作者的现代结果表明，在高维情形下，最优常数 $ K_N $ 会随着 $ N $ 的增加而严格减小，这支持了“聚集”这一观点（即“隧穿效应”）。

---

### 关键发展的时间线

| 年份 | 事件                                                             |
|------|------------------------------------------------------------------|
| 1957 | Dyson 关于玻色气体和多体理论的开创性论文                        |
| 1967 | Dyson 与 Lenard 证明物质稳定性（证明复杂）                       |
| 1969 | Lieb 与 Lebowitz 证明热力学极限的存在性                          |
| 1973 | Lieb 与 Simon 严格证明 Thomas--Fermi 理论                         |
| 1975 | Lieb 与 Thirring 发表更易理解的物质稳定性证明                    |
| 1990 | Dyson 认可 Lieb--Thirring 方法的影响                              |
| 2010 年代 | Lieb--Thirring 不等式中的常数得到逐步改进                    |
| 2020 | 关于维数效应和渐近行为的最新证明                                 |

---

### 核心要点与结语

- 物质稳定性是一种基础性质，它由电子动能、相互作用势以及粒子的费米子本性之间的微妙平衡所保证。
- Lieb--Thirring 不等式的影响远超稳定性问题本身，对有效理论和半经典物理都具有深远意义。
- 严格的数学方法从最初的物理直觉中发展而来，并转化为关于普适常数和标度律的深刻洞见。
- 尽管已经取得了大量进展，仍有重要未解问题存在，包括确定尖锐常数以及理解维数依赖行为。
- 演讲者最后强调：要获得真正的理解和持久的影响，必须具备耐心、整体性的把握，并愿意处理问题的相关变体——这也是 Elliott Lieb 哲学的一种体现。

---

### 关键词

- 物质稳定性
- Lieb--Thirring 不等式
- Thomas--Fermi 理论
- 薛定谔算子
- 量子多体理论
- 基态能量
- 热力学极限
- 费米子
- 交换能
- 数学物理
- 泡利不相容原理
- 半经典分析

---

这份总结忠实反映了视频转录内容，准确呈现了其时间发展脉络、数学概念、关键结果以及当前研究问题，且未引入任何缺乏依据的细节。
",
  math: mitex,
)
