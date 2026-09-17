# Machine Learning Methodology & Empirical Research Report

**Project:** Medical Insurance Cost Prediction Using Supervised Machine Learning  
**Task:** Regression on continuous target variable `charges` ($USD)  
**Academic Target:** Final-Year Engineering Project & Technical Viva Voce  

---

## 1. Dataset & Problem Formulation

### 1.1 Problem Definition
In healthcare economics and health insurance underwriting, accurately forecasting individual medical expenditure is critical for setting actuarially sound premiums and identifying high-risk clinical populations. The objective is to learn a mapping function:

$$\hat{y} = f(\mathbf{x})$$

where $\mathbf{x} \in \mathbb{R}^d$ represents demographic and health indicators, and $y = \text{charges} \in \mathbb{R}^+$ denotes the annual medical insurance expenditures in USD.

### 1.2 Dataset Properties
The benchmark **Medical Cost Personal Dataset** (`insurance.csv`) comprises:
- **Total observations:** 1,338 individual patient records.
- **Data cleaning:** Exactly 1 identical duplicate row was detected and dropped, leaving $N=1,337$ unique patient samples.
- **Missing values:** 0 null or missing values across all features.
- **Target Distribution:** Ranging from $\$1,121.87$ to $\$63,770.43$ (Mean: $\$13,279.12$, Median: $\$9,386.16$), exhibiting right-skewness due to catastrophic hospitalizations.

### 1.3 Feature Dictionary
| Feature | Nature | Scikit-Learn Handling | Domain Significance |
|---|---|---|---|
| `age` | Continuous Integer ($18 - 64$) | `StandardScaler` | Natural biological aging and medical utilization |
| `sex` | Categorical Binary (`male`, `female`) | `OneHotEncoder(drop='first')` | Gender-based health demographic variation |
| `bmi` | Continuous Float ($15.96 - 53.13$) | `StandardScaler` | Body Mass Index; threshold $\ge 30$ marks clinical obesity |
| `children`| Discrete Integer ($0 - 5$) | `StandardScaler` | Number of dependent children covered under policy |
| `smoker` | Categorical Binary (`yes`, `no`) | `OneHotEncoder(drop='first')` | **Single strongest predictive factor** for high charges |
| `region` | Categorical Multi-class (4 zones) | `OneHotEncoder(drop='first')` | Geographical variation in healthcare cost indices |

---

## 2. Preprocessing & Leakage-Free Pipeline Architecture

### 2.1 One-Hot Encoding & The Dummy Variable Trap
Categorical variables (`sex`, `smoker`, `region`) are encoded using `OneHotEncoder(drop='first', handle_unknown='ignore', sparse_output=False)`.
- For $k$ categories, dropping the first category creates $k-1$ binary features.
- **Why this is critical:** Keeping all $k$ categories introduces perfect multicollinearity ($\sum_{i=1}^k x_i = 1$). In Ordinary Least Squares (OLS), the Gram matrix $\mathbf{X}^T \mathbf{X}$ becomes singular and non-invertible, yielding unstable regression coefficients.

### 2.2 Feature Normalization in Distance Space
Because K-Nearest Neighbors relies on Euclidean distance:

$$d(\mathbf{p}, \mathbf{q}) = \sqrt{\sum_{j=1}^d (p_j - q_j)^2}$$

features with large natural magnitudes (e.g. `age` $\in [18, 64]$) would artificially dominate features bounded in $[0, 1]$ (e.g. `smoker_yes`).
- We apply `StandardScaler()` inside the `Pipeline` so that:

$$z_j = \frac{x_j - \mu_j}{\sigma_j}$$

- Crucially, $\mu_j$ and $\sigma_j$ are calculated **strictly from training folds** during cross-validation, completely eliminating data leakage.

---

## 3. Systematic Hyperparameter Tuning

Hyperparameter optimization was performed on training data ($N_{train} = 1,069$) using **5-Fold Cross-Validation** with fixed `random_state=42`.

### 3.1 Ridge Regularization Search ($\alpha$)
Evaluated across $\alpha \in [0.01, 0.1, 1.0, 10.0, 100.0, 1000.0]$:
- Regularization objective: $\min_{\beta} \|\mathbf{y} - \mathbf{X}\beta\|_2^2 + \alpha \|\beta\|_2^2$
- **Selected Optimal:** $\alpha = 1.0$ (Mean 5-fold CV $R^2 = 0.7228$, standard deviation $0.043$).

### 3.2 K-Nearest Neighbors Neighbors Search ($k$)
Evaluated across $k \in [3, 5, 7, 9, 11, 15, 21, 31]$:
- Distance metric: Minkowski distance with $p=2$ (Euclidean metric).
- **Selected Optimal:** $k = 9$ (Mean 5-fold CV $R^2 = 0.7673$, test $R^2 = 0.8185$).

---

## 4. Empirical Model Comparison

All models were evaluated on the held-out test set ($N_{test} = 268$, 20% split) using identical random seed (42):

| Model Architecture | Train $R^2$ | Held-Out Test $R^2$ | 5-Fold CV $R^2$ | Test MAE ($) | Test RMSE ($) |
|---|:---:|:---:|:---:|:---:|:---:|
| **Linear Regression (OLS)** | 0.7299 | 0.8069 | 0.7228 | $4,177.05 | $5,956.34 |
| **Ridge Regression ($\alpha=1.0$)** | 0.7299 | 0.8067 | 0.7228 | $4,179.62 | $5,959.23 |
| **KNN Regression ($k=9$)** *(Selected Best)* | **0.8234** | **0.8185** | **0.7673** | **$3,632.17** | **$5,775.73** |

### Selection Rationale:
**KNN Regression ($k=9$)** emerged as the top-performing model across all metrics:
1. **Highest Predictive Fit:** Delivers the highest test accuracy ($R^2 = 0.8185$) and the lowest mean absolute error ($\text{MAE} = \$3,632.17$), reducing prediction error by over $\$545$ compared to linear baselines.
2. **Non-Linear Interactions:** Unlike Linear and Ridge models that assume global linearity, KNN effectively captures local non-linear interactions (e.g. exponential medical claims for obese smokers) without manual polynomial feature engineering.
3. **Neighborhood Interpretability:** The instance-based neighborhood representation matches clinical actuarial comparisons ("patients with similar age, BMI, and smoking habits historically incurred similar claims").

---

## 5. Held-Out Test Set Error Analysis

### 5.1 Smoker Disparity
- **Non-Smokers ($n=208$):** Mean Actual: $\$8,202.99$, Mean Absolute Error: **$\$2,636.09$**
- **Smokers ($n=60$):** Mean Actual: $\$35,311.26$, Mean Absolute Error: **$\$7,085.22$**
- **Finding:** Prediction error is $2.6\times$ higher on smokers. While non-smokers have relatively predictable routine healthcare visits, smokers suffer from wide variance in underlying conditions (coronary procedures vs respiratory maintenance), leading to heteroskedastic residuals.

### 5.2 Age Brackets
- **18–30 years ($n=87$):** MAE = $\$3,703.45$
- **31–45 years ($n=79$):** MAE = $\$3,779.38$
- **46–64 years ($n=102$):** MAE = $\$3,457.35$
- **Finding:** Error magnitude is remarkably stable across age cohorts, confirming that age scaling successfully normalizes biological aging variance.

---

## 6. Dataset Limitations & Underwriting Scope

1. **Lack of Granular Clinical Diagnoses:** The dataset lacks ICD-10 diagnostic codes, prescription records, family medical history, and pre-existing chronic markers (e.g. diabetes, hypertension).
2. **Coarse Geographic Granularity:** Regional data is grouped into 4 broad US quadrants rather than municipal zip codes or local hospital network tiers.
3. **Temporal Validity:** Dataset charges reflect historical benchmarks. Real-world inflation and policy changes shift actuarial baselines over time.
4. **Scope:** The system is an educational and analytical tool, not a commercial underwriting rating engine.
