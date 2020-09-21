#[macro_export]
macro_rules! map {
    {} => { ::std::collections::HashMap::new() };
    { $($key:expr => $value:expr),*$(,)? } => {{
        let mut m = ::std::collections::HashMap::new();
        $(m.insert($key, $value);)*
        m
    }};
}

#[macro_export]
macro_rules! operator {
    {} => { crate::Operator::new() };
    { $($key:expr => $value:expr),*$(,)? } => {{
        let mut op = crate::Operator::new();
        $(op.insert($key, $value);)*
        op
    }};
}

#[macro_export]
macro_rules! tensor {
    {} => { crate::Tensor::new() };
    { $($key:expr => $value:expr),*$(,)? } => {{
        let mut t = crate::Tensor::new();
        $(t.insert($key, $value);)*
        t
    }};
}

#[macro_export]
macro_rules! enum_dimension {
    {
        $vis:vis enum $name:ident {
            $($variant:ident),*
            $(,)?
        }
    } => {
        #[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
        $vis enum $name {
            $($variant),*
        }

        impl crate::Enumerable for $name {
            type Iter = ::std::iter::Copied<::std::slice::Iter<'static, $name>>;
            fn enumerate() -> Self::Iter {
                const VARIANTS: [$name; [$($name::$variant),*].len()] = [$($name::$variant),*];
                VARIANTS.iter().copied()
            }
        }
    }
}
