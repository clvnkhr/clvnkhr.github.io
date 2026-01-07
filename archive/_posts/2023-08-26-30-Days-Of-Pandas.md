---
layout: post
title: 30 Days of Pandas
date: 2023-08-26
# updated: 2023-06-26
tags: [coding, maths]
splash_img_source: /assets/img/crystalballs.png
usemathjax: true
---

Quick notes on pandas (`import pandas as pd`)

lets say df is a pd.DataFrame. to select we can use df[...], df.loc[...] or df.iloc[...]

df[...] can be used to select one or more columns by their names, or to select rows by a boolean mask.
df.loc[...] can be used to select rows and columns by their labels, or by a boolean mask. The labels can be the index or column names, or a range of them.

df[…] cannot be used to select rows and columns simultaneously, unless the rows are selected by a boolean mask, so

Note df["colname"] and df.loc["colname"] will return a series: to return a df, use a list of column names i.e. df[["colname"]].

```python
# this will not work
df[1:3, 'name':'age']
```

df.iloc is loc but with indices instead of names.
There is also `df.query`, so `df.query("Salary == max_salary")` is equivalent to `df[df['Salary'] == max_salary]`

In the boolean mask, and and or are replaced by & and |. In addition, the logical expressions connected by & and | must be inside parens, e.g. (a) & (b).

To create a DataFrame from scratch and then modify:

```python
df = pd.DataFrame() # makes an empty df
df["newcol"] = list_like_var # also df = pd.DataFrame({newcol: list_like_var})
df.drop("colname") #removes column
```

`df.sort_values()` sorts according to the index by default. Takes an optional parameter `by="colname"`
`df["col"].unique()` returns a np.array of unique elements
`df.drop_duplicates()` returns a df without repeated rows.

- Has optional params subset = ["col1", "col2", ...] to indicate the cols that determine uniqueness
- Has optional params inplace=True (like many other methods)

`df.itertuples()` iterates over rows as tuples, e.g.

```python
    employees['bonus'] = [row.salary if (row.employee_id % 2 == 1 and lucky(row.name)) else 0 for row in employees.itertuples()]
```

`df["col"].apply(f)` applies `f` to each element of `df["col"]`

`pd.merge(df1, df2, on="col")` merges on the column.

- If the column names are different then there is left_on= and right_on=.
- By default, how="inner" which means that rows that do not have a common value on "col" are dropped. There is also:

  - how="outer": any extra rows are added with missing entries turned into NaN
  - how="left": left outer, i.e. only extra rows from the left are added
  - how="right" similarly
  - how="cross": creates a kronecker product of the two dfs.

- df.rank() gives a float ranking based on the position after sorting. Optional param ascending=False: same as sorted(lst, reversed=True). There is a more complicated optional param called method:

Suppose we have a dataframe called df with a column called ‘score’ that has the following values:
[10, 20, 20, 30, 40, 40, 40].
If we use df['score'].rank(method='average'), the rank values will be:
[1.0, 2.5, 2.5, 4.0, 6.0, 6.0, 6.0].
This is because the average of the positions of the equal values is used as the rank. For example, the two values of 20 are in positions 2 and 3, so their rank is (2 + 3) / 2 = 2.5.
If we use df['score'].rank(method='min'), the rank values will be:
[1.0, 2.0, 2.0, 4.0, 5.0, 5.0, 5.0].
This is because the minimum of the positions of the equal values is used as the rank. For example, the two values of 20 are in positions 2 and 3, so their rank is min(2, 3) = 2.
If we use df['score'].rank(method='max'), the rank values will be:
[1.0, 3.0, 3.0, 4.0, 7.0, 7.0, 7.0].
This is because the maximum of the positions of the equal values is used as the rank. For example, the two values of 20 are in positions 2 and 3, so their rank is max(2, 3) = 3.
If we use df['score'].rank(method='first'), the rank values will be:
[1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0].
This is because the order of appearance of the equal values is used as the rank. For example, the two values of 20 are in positions 2 and 3, but the first one has a lower rank than the second one.
If we use df['score'].rank(method='dense'), the rank values will be:
[1.0, 2.0, 2.0, 3.0, 4.0, 4.0, 4.0].
This is because the rank always increases by one between groups of equal values. For example, the two values of 20 have the same rank of 2, and the next value of 30 has a rank of 3.

- df.groupby("col") makes an intermediate object that is useful for further processing.

- df.melt and df.pivot are sort of inverses to each other.
  The `melt` method takes four arguments: `id_vars`, `value_vars`, `var_name`, and `value_name`. These arguments specify which columns of the pivoted dataframe to use as the identifier variables, value variables, variable name, and value name of the melted dataframe, respectively. For example, if you have a pivoted dataframe like this:

| type  | a   | b   | c   |
| ----- | --- | --- | --- |
| label |     |     |     |
| x     | 1   | 2   | 3   |
| y     | 4   | 5   | 6   |
| z     | 7   | 8   | 9   |

You can `melt` like this:

```python
melted_df = pivoted_df.melt(id_vars='label', value_vars=['a', 'b', 'c'], var_name='type', value_name='value')
```

The result will be a melted dataframe like this:

| label | type | value |
| ----- | ---- | ----- |
| x     | a    | 1     |
| x     | b    | 2     |
| x     | c    | 3     |
| y     | a    | 4     |
| y     | b    | 5     |
| y     | c    | 6     |
| z     | a    | 7     |
| z     | b    | 8     |
| z     | c    | 9     |

and you can go back using

```python
pivoted_df = melted_df.pivot(index='label', columns='type', values='value')
```

`df.reset_index()` turns the index back to the default (undos tuple indexing)
