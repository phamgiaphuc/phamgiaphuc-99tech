# Issues

> I assume that all the packages, imported hooks and components are already declared on the top of the code file.

1. Refactors the types in code

```
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
```

- We can change the code to make it more simplier: using `extends` keyword

```
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
```

2. Make the prop's name more accurate and meaningful

```
interface Props extends BoxProps {} --> interface WalletPageProps extends BoxProps {}
```

3. Errros in the `sortedBalances` and `formattedBalances`

```
  const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (lhsPriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
    }
    return false
  }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
    const leftPriority = getPriority(lhs.blockchain);
    const rightPriority = getPriority(rhs.blockchain);
    if (leftPriority > rightPriority) {
      return -1;
    } else if (rightPriority > leftPriority) {
      return 1;
    }
  });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })
```

- There is no declaration of `lhsPriority` in the first `filter` so this variable can be undefined.
- There is no use for `balancePriority` variable in the first `filter`
- The `WalletBalance` interface does not have the prop called `blockchain`. It can be `currency` prop or we can add the `blockchain` prop into the interface.
- Unnecessary `useMemo` dependency: The `useMemo` dependency list includes prices, but prices is not used within sortedBalances. This creates unnecessary recomputation whenever prices change.
- Format the nested condition in the first `filter` and second `sort` more precise and easy to understand and read.
- Add type for strict and safety rules to the.
- We can combine the `formattedBalances` and `sortedBalances` into one variable only or we can spilt it but the splitings must have strict and safety types

> Method 1:

```
  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount <= 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      })
      .map((balance: WalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return {
          ...balance,
          formatted: balance.amount.toFixed(),
          usdValue,
        } as FormattedWalletBalance;
      });
  }, [balances, prices]);
```

> Method 2:

```
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount <= 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      })
  }, [balances, prices]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      } as FormattedWalletBalance;
    })
  }, [sortedBalances]);
```

> I don't know if the condition is right logic or not. But I just keep it like the code representation.

4. Missing props in the `rows`

```
   const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
```

- The prop `classes` is missing in the `balance` or the `WalletPageProps`
- Using wrong value type: In the sorted item, the item has the type of `FormattedWalletBalance` but the sortedBalances has the type of `WalletBalance[]`. It is missing the `formatted` prop.
