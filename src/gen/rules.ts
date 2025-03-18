// @ts-nocheck
export default [
  {
    "name": "airflow-variable-name-task-id-mismatch",
    "code": "AIR001",
    "explanation": "## What it does\nChecks that the task variable name matches the `task_id` value for\nAirflow Operators.\n\n## Why is this bad?\nWhen initializing an Airflow Operator, for consistency, the variable\nname should match the `task_id` value. This makes it easier to\nfollow the flow of the DAG.\n\n## Example\n```python\nfrom airflow.operators import PythonOperator\n\n\nincorrect_name = PythonOperator(task_id=\"my_task\")\n```\n\nUse instead:\n```python\nfrom airflow.operators import PythonOperator\n\n\nmy_task = PythonOperator(task_id=\"my_task\")\n```\n"
  },
  {
    "name": "airflow-dag-no-schedule-argument",
    "code": "AIR301",
    "explanation": "## What it does\nChecks for a `DAG()` class or `@dag()` decorator without an explicit\n`schedule` parameter.\n\n## Why is this bad?\nThe default `schedule` value on Airflow 2 is `timedelta(days=1)`, which is\nalmost never what a user is looking for. Airflow 3 changes this the default\nto *None*, and would break existing DAGs using the implicit default.\n\nIf your DAG does not have an explicit `schedule` argument, Airflow 2\nschedules a run for it every day (at the time determined by `start_date`).\nSuch a DAG will no longer be scheduled on Airflow 3 at all, without any\nexceptions or other messages visible to the user.\n\n## Example\n```python\nfrom airflow import DAG\n\n\n# Using the implicit default schedule.\ndag = DAG(dag_id=\"my_dag\")\n```\n\nUse instead:\n```python\nfrom datetime import timedelta\n\nfrom airflow import DAG\n\n\ndag = DAG(dag_id=\"my_dag\", schedule=timedelta(days=1))\n```\n",
    "preview": true
  },
  {
    "name": "airflow3-removal",
    "code": "AIR302",
    "explanation": "## What it does\nChecks for uses of deprecated Airflow functions and values.\n\n## Why is this bad?\nAirflow 3.0 removed various deprecated functions, members, and other\nvalues. Some have more modern replacements. Others are considered too niche\nand not worth to be maintained in Airflow.\n\n## Example\n```python\nfrom airflow.utils.dates import days_ago\n\n\nyesterday = days_ago(today, 1)\n```\n\nUse instead:\n```python\nfrom datetime import timedelta\n\n\nyesterday = today - timedelta(days=1)\n```\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "airflow3-moved-to-provider",
    "code": "AIR303",
    "explanation": "## What it does\nChecks for uses of Airflow functions and values that have been moved to it providers.\n(e.g., apache-airflow-providers-fab)\n\n## Why is this bad?\nAirflow 3.0 moved various deprecated functions, members, and other\nvalues to its providers. The user needs to install the corresponding provider and replace\nthe original usage with the one in the provider\n\n## Example\n```python\nfrom airflow.auth.managers.fab.fab_auth_manage import FabAuthManager\n```\n\nUse instead:\n```python\nfrom airflow.providers.fab.auth_manager.fab_auth_manage import FabAuthManager\n```\n",
    "preview": true
  },
  {
    "name": "commented-out-code",
    "code": "ERA001",
    "explanation": "## What it does\nChecks for commented-out Python code.\n\n## Why is this bad?\nCommented-out code is dead code, and is often included inadvertently.\nIt should be removed.\n\n## Known problems\nProne to false positives when checking comments that resemble Python code,\nbut are not actually Python code ([#4845]).\n\n## Example\n```python\n# print(\"Hello, world!\")\n```\n\n## Options\n- `lint.task-tags`\n\n[#4845]: https://github.com/astral-sh/ruff/issues/4845\n"
  },
  {
    "name": "fast-api-redundant-response-model",
    "code": "FAST001",
    "explanation": "## What it does\nChecks for FastAPI routes that use the optional `response_model` parameter\nwith the same type as the return type.\n\n## Why is this bad?\nFastAPI routes automatically infer the response model type from the return\ntype, so specifying it explicitly is redundant.\n\nThe `response_model` parameter is used to override the default response\nmodel type. For example, `response_model` can be used to specify that\na non-serializable response type should instead be serialized via an\nalternative type.\n\nFor more information, see the [FastAPI documentation](https://fastapi.tiangolo.com/tutorial/response-model/).\n\n## Example\n\n```python\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\n\nclass Item(BaseModel):\n    name: str\n\n\n@app.post(\"/items/\", response_model=Item)\nasync def create_item(item: Item) -> Item:\n    return item\n```\n\nUse instead:\n\n```python\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\n\nclass Item(BaseModel):\n    name: str\n\n\n@app.post(\"/items/\")\nasync def create_item(item: Item) -> Item:\n    return item\n```\n",
    "fix": 2
  },
  {
    "name": "fast-api-non-annotated-dependency",
    "code": "FAST002",
    "explanation": "## What it does\nIdentifies FastAPI routes with deprecated uses of `Depends` or similar.\n\n## Why is this bad?\nThe [FastAPI documentation] recommends the use of [`typing.Annotated`][typing-annotated]\nfor defining route dependencies and parameters, rather than using `Depends`,\n`Query` or similar as a default value for a parameter. Using this approach\neverywhere helps ensure consistency and clarity in defining dependencies\nand parameters.\n\n`Annotated` was added to the `typing` module in Python 3.9; however,\nthe third-party [`typing_extensions`][typing-extensions] package\nprovides a backport that can be used on older versions of Python.\n\n## Example\n\n```python\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\n\nasync def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):\n    return {\"q\": q, \"skip\": skip, \"limit\": limit}\n\n\n@app.get(\"/items/\")\nasync def read_items(commons: dict = Depends(common_parameters)):\n    return commons\n```\n\nUse instead:\n\n```python\nfrom typing import Annotated\n\nfrom fastapi import Depends, FastAPI\n\napp = FastAPI()\n\n\nasync def common_parameters(q: str | None = None, skip: int = 0, limit: int = 100):\n    return {\"q\": q, \"skip\": skip, \"limit\": limit}\n\n\n@app.get(\"/items/\")\nasync def read_items(commons: Annotated[dict, Depends(common_parameters)]):\n    return commons\n```\n\n[FastAPI documentation]: https://fastapi.tiangolo.com/tutorial/query-params-str-validations/?h=annotated#advantages-of-annotated\n[typing-annotated]: https://docs.python.org/3/library/typing.html#typing.Annotated\n[typing-extensions]: https://typing-extensions.readthedocs.io/en/stable/\n",
    "fix": 1
  },
  {
    "name": "fast-api-unused-path-parameter",
    "code": "FAST003",
    "explanation": "## What it does\nIdentifies FastAPI routes that declare path parameters in the route path\nthat are not included in the function signature.\n\n## Why is this bad?\nPath parameters are used to extract values from the URL path.\n\nIf a path parameter is declared in the route path but not in the function\nsignature, it will not be accessible in the function body, which is likely\na mistake.\n\nIf a path parameter is declared in the route path, but as a positional-only\nargument in the function signature, it will also not be accessible in the\nfunction body, as FastAPI will not inject the parameter.\n\n## Known problems\nIf the path parameter is _not_ a valid Python identifier (e.g., `user-id`, as\nopposed to `user_id`), FastAPI will normalize it. However, this rule simply\nignores such path parameters, as FastAPI's normalization behavior is undocumented.\n\n## Example\n\n```python\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n\n@app.get(\"/things/{thing_id}\")\nasync def read_thing(query: str): ...\n```\n\nUse instead:\n\n```python\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n\n@app.get(\"/things/{thing_id}\")\nasync def read_thing(thing_id: int, query: str): ...\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as modifying a function signature can\nchange the behavior of the code.\n",
    "fix": 1
  },
  {
    "name": "sys-version-slice3",
    "code": "YTT101",
    "explanation": "## What it does\nChecks for uses of `sys.version[:3]`.\n\n## Why is this bad?\nIf the current major or minor version consists of multiple digits,\n`sys.version[:3]` will truncate the version number (e.g., `\"3.10\"` would\nbecome `\"3.1\"`). This is likely unintended, and can lead to subtle bugs if\nthe version string is used to test against a specific Python version.\n\nInstead, use `sys.version_info` to access the current major and minor\nversion numbers as a tuple, which can be compared to other tuples\nwithout issue.\n\n## Example\n```python\nimport sys\n\nsys.version[:3]  # Evaluates to \"3.1\" on Python 3.10.\n```\n\nUse instead:\n```python\nimport sys\n\nsys.version_info[:2]  # Evaluates to (3, 10) on Python 3.10.\n```\n\n## References\n- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)\n- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)\n"
  },
  {
    "name": "sys-version2",
    "code": "YTT102",
    "explanation": "## What it does\nChecks for uses of `sys.version[2]`.\n\n## Why is this bad?\nIf the current major or minor version consists of multiple digits,\n`sys.version[2]` will select the first digit of the minor number only\n(e.g., `\"3.10\"` would evaluate to `\"1\"`). This is likely unintended, and\ncan lead to subtle bugs if the version is used to test against a minor\nversion number.\n\nInstead, use `sys.version_info.minor` to access the current minor version\nnumber.\n\n## Example\n```python\nimport sys\n\nsys.version[2]  # Evaluates to \"1\" on Python 3.10.\n```\n\nUse instead:\n```python\nimport sys\n\nf\"{sys.version_info.minor}\"  # Evaluates to \"10\" on Python 3.10.\n```\n\n## References\n- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)\n- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)\n"
  },
  {
    "name": "sys-version-cmp-str3",
    "code": "YTT103",
    "explanation": "## What it does\nChecks for comparisons that test `sys.version` against string literals,\nsuch that the comparison will evaluate to `False` on Python 3.10 or later.\n\n## Why is this bad?\nComparing `sys.version` to a string is error-prone and may cause subtle\nbugs, as the comparison will be performed lexicographically, not\nsemantically. For example, `sys.version > \"3.9\"` will evaluate to `False`\nwhen using Python 3.10, as `\"3.10\"` is lexicographically \"less\" than\n`\"3.9\"`.\n\nInstead, use `sys.version_info` to access the current major and minor\nversion numbers as a tuple, which can be compared to other tuples\nwithout issue.\n\n## Example\n```python\nimport sys\n\nsys.version > \"3.9\"  # `False` on Python 3.10.\n```\n\nUse instead:\n```python\nimport sys\n\nsys.version_info > (3, 9)  # `True` on Python 3.10.\n```\n\n## References\n- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)\n- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)\n"
  },
  {
    "name": "sys-version-info0-eq3",
    "code": "YTT201",
    "explanation": "## What it does\nChecks for equality comparisons against the major version returned by\n`sys.version_info` (e.g., `sys.version_info[0] == 3`).\n\n## Why is this bad?\nUsing `sys.version_info[0] == 3` to verify that the major version is\nPython 3 or greater will fail if the major version number is ever\nincremented (e.g., to Python 4). This is likely unintended, as code\nthat uses this comparison is likely intended to be run on Python 2,\nbut would now run on Python 4 too.\n\nInstead, use `>=` to check if the major version number is 3 or greater,\nto future-proof the code.\n\n## Example\n```python\nimport sys\n\nif sys.version_info[0] == 3:\n    ...\nelse:\n    print(\"Python 2\")  # This will be printed on Python 4.\n```\n\nUse instead:\n```python\nimport sys\n\nif sys.version_info >= (3,):\n    ...\nelse:\n    print(\"Python 2\")  # This will not be printed on Python 4.\n```\n\n## References\n- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)\n- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)\n"
  },
  {
    "name": "six-py3",
    "code": "YTT202",
    "explanation": "## What it does\nChecks for uses of `six.PY3`.\n\n## Why is this bad?\n`six.PY3` will evaluate to `False` on Python 4 and greater. This is likely\nunintended, and may cause code intended to run on Python 2 to run on Python 4\ntoo.\n\nInstead, use `not six.PY2` to validate that the current Python major version is\n_not_ equal to 2, to future-proof the code.\n\n## Example\n```python\nimport six\n\nsix.PY3  # `False` on Python 4.\n```\n\nUse instead:\n```python\nimport six\n\nnot six.PY2  # `True` on Python 4.\n```\n\n## References\n- [PyPI: `six`](https://pypi.org/project/six/)\n- [Six documentation: `six.PY2`](https://six.readthedocs.io/#six.PY2)\n- [Six documentation: `six.PY3`](https://six.readthedocs.io/#six.PY3)\n"
  },
  {
    "name": "sys-version-info1-cmp-int",
    "code": "YTT203",
    "explanation": "## What it does\nChecks for comparisons that test `sys.version_info[1]` against an integer.\n\n## Why is this bad?\nComparisons based on the current minor version number alone can cause\nsubtle bugs and would likely lead to unintended effects if the Python\nmajor version number were ever incremented (e.g., to Python 4).\n\nInstead, compare `sys.version_info` to a tuple, including the major and\nminor version numbers, to future-proof the code.\n\n## Example\n```python\nimport sys\n\nif sys.version_info[1] < 7:\n    print(\"Python 3.6 or earlier.\")  # This will be printed on Python 4.0.\n```\n\nUse instead:\n```python\nimport sys\n\nif sys.version_info < (3, 7):\n    print(\"Python 3.6 or earlier.\")\n```\n\n## References\n- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)\n- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)\n"
  },
  {
    "name": "sys-version-info-minor-cmp-int",
    "code": "YTT204",
    "explanation": "## What it does\nChecks for comparisons that test `sys.version_info.minor` against an integer.\n\n## Why is this bad?\nComparisons based on the current minor version number alone can cause\nsubtle bugs and would likely lead to unintended effects if the Python\nmajor version number were ever incremented (e.g., to Python 4).\n\nInstead, compare `sys.version_info` to a tuple, including the major and\nminor version numbers, to future-proof the code.\n\n## Example\n```python\nimport sys\n\nif sys.version_info.minor < 7:\n    print(\"Python 3.6 or earlier.\")  # This will be printed on Python 4.0.\n```\n\nUse instead:\n```python\nimport sys\n\nif sys.version_info < (3, 7):\n    print(\"Python 3.6 or earlier.\")\n```\n\n## References\n- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)\n- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)\n"
  },
  {
    "name": "sys-version0",
    "code": "YTT301",
    "explanation": "## What it does\nChecks for uses of `sys.version[0]`.\n\n## Why is this bad?\nIf the current major or minor version consists of multiple digits,\n`sys.version[0]` will select the first digit of the major version number\nonly (e.g., `\"10.2\"` would evaluate to `\"1\"`). This is likely unintended,\nand can lead to subtle bugs if the version string is used to test against a\nmajor version number.\n\nInstead, use `sys.version_info.major` to access the current major version\nnumber.\n\n## Example\n```python\nimport sys\n\nsys.version[0]  # If using Python 10, this evaluates to \"1\".\n```\n\nUse instead:\n```python\nimport sys\n\nf\"{sys.version_info.major}\"  # If using Python 10, this evaluates to \"10\".\n```\n\n## References\n- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)\n- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)\n"
  },
  {
    "name": "sys-version-cmp-str10",
    "code": "YTT302",
    "explanation": "## What it does\nChecks for comparisons that test `sys.version` against string literals,\nsuch that the comparison would fail if the major version number were\never incremented to Python 10 or higher.\n\n## Why is this bad?\nComparing `sys.version` to a string is error-prone and may cause subtle\nbugs, as the comparison will be performed lexicographically, not\nsemantically.\n\nInstead, use `sys.version_info` to access the current major and minor\nversion numbers as a tuple, which can be compared to other tuples\nwithout issue.\n\n## Example\n```python\nimport sys\n\nsys.version >= \"3\"  # `False` on Python 10.\n```\n\nUse instead:\n```python\nimport sys\n\nsys.version_info >= (3,)  # `True` on Python 10.\n```\n\n## References\n- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)\n- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)\n"
  },
  {
    "name": "sys-version-slice1",
    "code": "YTT303",
    "explanation": "## What it does\nChecks for uses of `sys.version[:1]`.\n\n## Why is this bad?\nIf the major version number consists of more than one digit, this will\nselect the first digit of the major version number only (e.g., `\"10.0\"`\nwould evaluate to `\"1\"`). This is likely unintended, and can lead to subtle\nbugs in future versions of Python if the version string is used to test\nagainst a specific major version number.\n\nInstead, use `sys.version_info.major` to access the current major version\nnumber.\n\n## Example\n```python\nimport sys\n\nsys.version[:1]  # If using Python 10, this evaluates to \"1\".\n```\n\nUse instead:\n```python\nimport sys\n\nf\"{sys.version_info.major}\"  # If using Python 10, this evaluates to \"10\".\n```\n\n## References\n- [Python documentation: `sys.version`](https://docs.python.org/3/library/sys.html#sys.version)\n- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)\n"
  },
  {
    "name": "missing-type-function-argument",
    "code": "ANN001",
    "explanation": "## What it does\nChecks that function arguments have type annotations.\n\n## Why is this bad?\nType annotations are a good way to document the types of function arguments. They also\nhelp catch bugs, when used alongside a type checker, by ensuring that the types of\nany provided arguments match expectation.\n\n## Example\n\n```python\ndef foo(x): ...\n```\n\nUse instead:\n\n```python\ndef foo(x: int): ...\n```\n\n## Options\n- `lint.flake8-annotations.suppress-dummy-args`\n"
  },
  {
    "name": "missing-type-args",
    "code": "ANN002",
    "explanation": "## What it does\nChecks that function `*args` arguments have type annotations.\n\n## Why is this bad?\nType annotations are a good way to document the types of function arguments. They also\nhelp catch bugs, when used alongside a type checker, by ensuring that the types of\nany provided arguments match expectation.\n\n## Example\n\n```python\ndef foo(*args): ...\n```\n\nUse instead:\n\n```python\ndef foo(*args: int): ...\n```\n\n## Options\n- `lint.flake8-annotations.suppress-dummy-args`\n"
  },
  {
    "name": "missing-type-kwargs",
    "code": "ANN003",
    "explanation": "## What it does\nChecks that function `**kwargs` arguments have type annotations.\n\n## Why is this bad?\nType annotations are a good way to document the types of function arguments. They also\nhelp catch bugs, when used alongside a type checker, by ensuring that the types of\nany provided arguments match expectation.\n\n## Example\n\n```python\ndef foo(**kwargs): ...\n```\n\nUse instead:\n\n```python\ndef foo(**kwargs: int): ...\n```\n\n## Options\n- `lint.flake8-annotations.suppress-dummy-args`\n"
  },
  {
    "name": "missing-type-self",
    "code": "ANN101",
    "explanation": "## Removed\nThis rule has been removed because type checkers can infer this type without annotation.\n\n## What it does\nChecks that instance method `self` arguments have type annotations.\n\n## Why is this bad?\nType annotations are a good way to document the types of function arguments. They also\nhelp catch bugs, when used alongside a type checker, by ensuring that the types of\nany provided arguments match expectation.\n\nNote that many type checkers will infer the type of `self` automatically, so this\nannotation is not strictly necessary.\n\n## Example\n\n```python\nclass Foo:\n    def bar(self): ...\n```\n\nUse instead:\n\n```python\nclass Foo:\n    def bar(self: \"Foo\"): ...\n```\n"
  },
  {
    "name": "missing-type-cls",
    "code": "ANN102",
    "explanation": "## Removed\nThis rule has been removed because type checkers can infer this type without annotation.\n\n## What it does\nChecks that class method `cls` arguments have type annotations.\n\n## Why is this bad?\nType annotations are a good way to document the types of function arguments. They also\nhelp catch bugs, when used alongside a type checker, by ensuring that the types of\nany provided arguments match expectation.\n\nNote that many type checkers will infer the type of `cls` automatically, so this\nannotation is not strictly necessary.\n\n## Example\n\n```python\nclass Foo:\n    @classmethod\n    def bar(cls): ...\n```\n\nUse instead:\n\n```python\nclass Foo:\n    @classmethod\n    def bar(cls: Type[\"Foo\"]): ...\n```\n"
  },
  {
    "name": "missing-return-type-undocumented-public-function",
    "code": "ANN201",
    "explanation": "## What it does\nChecks that public functions and methods have return type annotations.\n\n## Why is this bad?\nType annotations are a good way to document the return types of functions. They also\nhelp catch bugs, when used alongside a type checker, by ensuring that the types of\nany returned values, and the types expected by callers, match expectation.\n\n## Example\n```python\ndef add(a, b):\n    return a + b\n```\n\nUse instead:\n```python\ndef add(a: int, b: int) -> int:\n    return a + b\n```\n",
    "fix": 1
  },
  {
    "name": "missing-return-type-private-function",
    "code": "ANN202",
    "explanation": "## What it does\nChecks that private functions and methods have return type annotations.\n\n## Why is this bad?\nType annotations are a good way to document the return types of functions. They also\nhelp catch bugs, when used alongside a type checker, by ensuring that the types of\nany returned values, and the types expected by callers, match expectation.\n\n## Example\n```python\ndef _add(a, b):\n    return a + b\n```\n\nUse instead:\n```python\ndef _add(a: int, b: int) -> int:\n    return a + b\n```\n",
    "fix": 1
  },
  {
    "name": "missing-return-type-special-method",
    "code": "ANN204",
    "explanation": "## What it does\nChecks that \"special\" methods, like `__init__`, `__new__`, and `__call__`, have\nreturn type annotations.\n\n## Why is this bad?\nType annotations are a good way to document the return types of functions. They also\nhelp catch bugs, when used alongside a type checker, by ensuring that the types of\nany returned values, and the types expected by callers, match expectation.\n\nNote that type checkers often allow you to omit the return type annotation for\n`__init__` methods, as long as at least one argument has a type annotation. To\nopt in to this behavior, use the `mypy-init-return` setting in your `pyproject.toml`\nor `ruff.toml` file:\n\n```toml\n[tool.ruff.lint.flake8-annotations]\nmypy-init-return = true\n```\n\n## Example\n```python\nclass Foo:\n    def __init__(self, x: int):\n        self.x = x\n```\n\nUse instead:\n```python\nclass Foo:\n    def __init__(self, x: int) -> None:\n        self.x = x\n```\n",
    "fix": 1
  },
  {
    "name": "missing-return-type-static-method",
    "code": "ANN205",
    "explanation": "## What it does\nChecks that static methods have return type annotations.\n\n## Why is this bad?\nType annotations are a good way to document the return types of functions. They also\nhelp catch bugs, when used alongside a type checker, by ensuring that the types of\nany returned values, and the types expected by callers, match expectation.\n\n## Example\n```python\nclass Foo:\n    @staticmethod\n    def bar():\n        return 1\n```\n\nUse instead:\n```python\nclass Foo:\n    @staticmethod\n    def bar() -> int:\n        return 1\n```\n",
    "fix": 1
  },
  {
    "name": "missing-return-type-class-method",
    "code": "ANN206",
    "explanation": "## What it does\nChecks that class methods have return type annotations.\n\n## Why is this bad?\nType annotations are a good way to document the return types of functions. They also\nhelp catch bugs, when used alongside a type checker, by ensuring that the types of\nany returned values, and the types expected by callers, match expectation.\n\n## Example\n```python\nclass Foo:\n    @classmethod\n    def bar(cls):\n        return 1\n```\n\nUse instead:\n```python\nclass Foo:\n    @classmethod\n    def bar(cls) -> int:\n        return 1\n```\n",
    "fix": 1
  },
  {
    "name": "any-type",
    "code": "ANN401",
    "explanation": "## What it does\nChecks that function arguments are annotated with a more specific type than\n`Any`.\n\n## Why is this bad?\n`Any` is a special type indicating an unconstrained type. When an\nexpression is annotated with type `Any`, type checkers will allow all\noperations on it.\n\nIt's better to be explicit about the type of an expression, and to use\n`Any` as an \"escape hatch\" only when it is really needed.\n\n## Example\n\n```python\ndef foo(x: Any): ...\n```\n\nUse instead:\n\n```python\ndef foo(x: int): ...\n```\n\n## Known problems\n\nType aliases are unsupported and can lead to false positives.\nFor example, the following will trigger this rule inadvertently:\n\n```python\nfrom typing import Any\n\nMyAny = Any\n\n\ndef foo(x: MyAny): ...\n```\n\n## References\n- [Typing spec: `Any`](https://typing.readthedocs.io/en/latest/spec/special-types.html#any)\n- [Python documentation: `typing.Any`](https://docs.python.org/3/library/typing.html#typing.Any)\n- [Mypy documentation: The Any type](https://mypy.readthedocs.io/en/stable/kinds_of_types.html#the-any-type)\n"
  },
  {
    "name": "cancel-scope-no-checkpoint",
    "code": "ASYNC100",
    "explanation": "## What it does\nChecks for timeout context managers which do not contain a checkpoint.\n\nFor the purposes of this check, `yield` is considered a checkpoint,\nsince checkpoints may occur in the caller to which we yield.\n\n## Why is this bad?\nSome asynchronous context managers, such as `asyncio.timeout` and\n`trio.move_on_after`, have no effect unless they contain a checkpoint.\nThe use of such context managers without an `await`, `async with` or\n`async for` statement is likely a mistake.\n\n## Example\n```python\nasync def func():\n    async with asyncio.timeout(2):\n        do_something()\n```\n\nUse instead:\n```python\nasync def func():\n    async with asyncio.timeout(2):\n        do_something()\n        await awaitable()\n```\n\n## References\n- [`asyncio` timeouts](https://docs.python.org/3/library/asyncio-task.html#timeouts)\n- [`anyio` timeouts](https://anyio.readthedocs.io/en/stable/cancellation.html)\n- [`trio` timeouts](https://trio.readthedocs.io/en/stable/reference-core.html#cancellation-and-timeouts)\n"
  },
  {
    "name": "trio-sync-call",
    "code": "ASYNC105",
    "explanation": "## What it does\nChecks for calls to trio functions that are not immediately awaited.\n\n## Why is this bad?\nMany of the functions exposed by trio are asynchronous, and must be awaited\nto take effect. Calling a trio function without an `await` can lead to\n`RuntimeWarning` diagnostics and unexpected behaviour.\n\n## Example\n```python\nasync def double_sleep(x):\n    trio.sleep(2 * x)\n```\n\nUse instead:\n```python\nasync def double_sleep(x):\n    await trio.sleep(2 * x)\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as adding an `await` to a function\ncall changes its semantics and runtime behavior.\n",
    "fix": 1
  },
  {
    "name": "async-function-with-timeout",
    "code": "ASYNC109",
    "explanation": "## What it does\nChecks for `async` function definitions with `timeout` parameters.\n\n## Why is this bad?\nRather than implementing asynchronous timeout behavior manually, prefer\nbuilt-in timeout functionality, such as `asyncio.timeout`, `trio.fail_after`,\nor `anyio.move_on_after`, among others.\n\nThis rule is highly opinionated to enforce a design pattern\ncalled [\"structured concurrency\"] that allows for\n`async` functions to be oblivious to timeouts,\ninstead letting callers to handle the logic with a context manager.\n\n## Details\n\nThis rule attempts to detect which async framework your code is using\nby analysing the imports in the file it's checking. If it sees an\n`anyio` import in your code, it will assume `anyio` is your framework\nof choice; if it sees a `trio` import, it will assume `trio`; if it\nsees neither, it will assume `asyncio`. `asyncio.timeout` was added\nin Python 3.11, so if `asyncio` is detected as the framework being used,\nthis rule will be ignored when your configured [`target-version`] is set\nto less than Python 3.11.\n\nFor functions that wrap `asyncio.timeout`, `trio.fail_after` or\n`anyio.move_on_after`, false positives from this rule can be avoided\nby using a different parameter name.\n\n## Example\n\n```python\nasync def long_running_task(timeout): ...\n\n\nasync def main():\n    await long_running_task(timeout=2)\n```\n\nUse instead:\n\n```python\nasync def long_running_task(): ...\n\n\nasync def main():\n    async with asyncio.timeout(2):\n        await long_running_task()\n```\n\n## References\n- [`asyncio` timeouts](https://docs.python.org/3/library/asyncio-task.html#timeouts)\n- [`anyio` timeouts](https://anyio.readthedocs.io/en/stable/cancellation.html)\n- [`trio` timeouts](https://trio.readthedocs.io/en/stable/reference-core.html#cancellation-and-timeouts)\n\n[\"structured concurrency\"]: https://vorpus.org/blog/some-thoughts-on-asynchronous-api-design-in-a-post-asyncawait-world/#timeouts-and-cancellation\n"
  },
  {
    "name": "async-busy-wait",
    "code": "ASYNC110",
    "explanation": "## What it does\nChecks for the use of an async sleep function in a `while` loop.\n\n## Why is this bad?\nInstead of sleeping in a `while` loop, and waiting for a condition\nto become true, it's preferable to `await` on an `Event` object such\nas: `asyncio.Event`, `trio.Event`, or `anyio.Event`.\n\n## Example\n```python\nDONE = False\n\n\nasync def func():\n    while not DONE:\n        await asyncio.sleep(1)\n```\n\nUse instead:\n```python\nDONE = asyncio.Event()\n\n\nasync def func():\n    await DONE.wait()\n```\n\n## References\n- [`asyncio` events](https://docs.python.org/3/library/asyncio-sync.html#asyncio.Event)\n- [`anyio` events](https://anyio.readthedocs.io/en/latest/api.html#anyio.Event)\n- [`trio` events](https://trio.readthedocs.io/en/latest/reference-core.html#trio.Event)\n"
  },
  {
    "name": "async-zero-sleep",
    "code": "ASYNC115",
    "explanation": "## What it does\nChecks for uses of `trio.sleep(0)` or `anyio.sleep(0)`.\n\n## Why is this bad?\n`trio.sleep(0)` is equivalent to calling `trio.lowlevel.checkpoint()`.\nHowever, the latter better conveys the intent of the code.\n\n## Example\n```python\nimport trio\n\n\nasync def func():\n    await trio.sleep(0)\n```\n\nUse instead:\n```python\nimport trio\n\n\nasync def func():\n    await trio.lowlevel.checkpoint()\n```\n",
    "fix": 2
  },
  {
    "name": "long-sleep-not-forever",
    "code": "ASYNC116",
    "explanation": "## What it does\nChecks for uses of `trio.sleep()` or `anyio.sleep()` with a delay greater than 24 hours.\n\n## Why is this bad?\nCalling `sleep()` with a delay greater than 24 hours is usually intended\nto sleep indefinitely. Instead of using a large delay,\n`trio.sleep_forever()` or `anyio.sleep_forever()` better conveys the intent.\n\n\n## Example\n```python\nimport trio\n\n\nasync def func():\n    await trio.sleep(86401)\n```\n\nUse instead:\n```python\nimport trio\n\n\nasync def func():\n    await trio.sleep_forever()\n```\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "blocking-http-call-in-async-function",
    "code": "ASYNC210",
    "explanation": "## What it does\nChecks that async functions do not contain blocking HTTP calls.\n\n## Why is this bad?\nBlocking an async function via a blocking HTTP call will block the entire\nevent loop, preventing it from executing other tasks while waiting for the\nHTTP response, negating the benefits of asynchronous programming.\n\nInstead of making a blocking HTTP call, use an asynchronous HTTP client\nlibrary such as `aiohttp` or `httpx`.\n\n## Example\n```python\nasync def fetch():\n    urllib.request.urlopen(\"https://example.com/foo/bar\").read()\n```\n\nUse instead:\n```python\nasync def fetch():\n    async with aiohttp.ClientSession() as session:\n        async with session.get(\"https://example.com/foo/bar\") as resp:\n            ...\n```\n"
  },
  {
    "name": "create-subprocess-in-async-function",
    "code": "ASYNC220",
    "explanation": "## What it does\nChecks that async functions do not create subprocesses with blocking methods.\n\n## Why is this bad?\nBlocking an async function via a blocking call will block the entire\nevent loop, preventing it from executing other tasks while waiting for the\ncall to complete, negating the benefits of asynchronous programming.\n\nInstead of making a blocking call, use an equivalent asynchronous library\nor function, like [`trio.run_process()`](https://trio.readthedocs.io/en/stable/reference-io.html#trio.run_process)\nor [`anyio.run_process()`](https://anyio.readthedocs.io/en/latest/api.html#anyio.run_process).\n\n## Example\n```python\nasync def foo():\n    os.popen(cmd)\n```\n\nUse instead:\n```python\nasync def foo():\n    asyncio.create_subprocess_shell(cmd)\n```\n"
  },
  {
    "name": "run-process-in-async-function",
    "code": "ASYNC221",
    "explanation": "## What it does\nChecks that async functions do not run processes with blocking methods.\n\n## Why is this bad?\nBlocking an async function via a blocking call will block the entire\nevent loop, preventing it from executing other tasks while waiting for the\ncall to complete, negating the benefits of asynchronous programming.\n\nInstead of making a blocking call, use an equivalent asynchronous library\nor function, like [`trio.run_process()`](https://trio.readthedocs.io/en/stable/reference-io.html#trio.run_process)\nor [`anyio.run_process()`](https://anyio.readthedocs.io/en/latest/api.html#anyio.run_process).\n\n## Example\n```python\nasync def foo():\n    subprocess.run(cmd)\n```\n\nUse instead:\n```python\nasync def foo():\n    asyncio.create_subprocess_shell(cmd)\n```\n"
  },
  {
    "name": "wait-for-process-in-async-function",
    "code": "ASYNC222",
    "explanation": "## What it does\nChecks that async functions do not wait on processes with blocking methods.\n\n## Why is this bad?\nBlocking an async function via a blocking call will block the entire\nevent loop, preventing it from executing other tasks while waiting for the\ncall to complete, negating the benefits of asynchronous programming.\n\nInstead of making a blocking call, use an equivalent asynchronous library\nor function, like [`trio.to_thread.run_sync()`](https://trio.readthedocs.io/en/latest/reference-core.html#trio.to_thread.run_sync)\nor [`anyio.to_thread.run_sync()`](https://anyio.readthedocs.io/en/latest/api.html#anyio.to_thread.run_sync).\n\n## Example\n```python\nasync def foo():\n    os.waitpid(0)\n```\n\nUse instead:\n```python\ndef wait_for_process():\n    os.waitpid(0)\n\n\nasync def foo():\n    await asyncio.loop.run_in_executor(None, wait_for_process)\n```\n"
  },
  {
    "name": "blocking-open-call-in-async-function",
    "code": "ASYNC230",
    "explanation": "## What it does\nChecks that async functions do not open files with blocking methods like `open`.\n\n## Why is this bad?\nBlocking an async function via a blocking call will block the entire\nevent loop, preventing it from executing other tasks while waiting for the\ncall to complete, negating the benefits of asynchronous programming.\n\nInstead of making a blocking call, use an equivalent asynchronous library\nor function.\n\n## Example\n```python\nasync def foo():\n    with open(\"bar.txt\") as f:\n        contents = f.read()\n```\n\nUse instead:\n```python\nimport anyio\n\n\nasync def foo():\n    async with await anyio.open_file(\"bar.txt\") as f:\n        contents = await f.read()\n```\n"
  },
  {
    "name": "blocking-sleep-in-async-function",
    "code": "ASYNC251",
    "explanation": "## What it does\nChecks that async functions do not call `time.sleep`.\n\n## Why is this bad?\nBlocking an async function via a `time.sleep` call will block the entire\nevent loop, preventing it from executing other tasks while waiting for the\n`time.sleep`, negating the benefits of asynchronous programming.\n\nInstead of `time.sleep`, use `asyncio.sleep`.\n\n## Example\n```python\nasync def fetch():\n    time.sleep(1)\n```\n\nUse instead:\n```python\nasync def fetch():\n    await asyncio.sleep(1)\n```\n"
  },
  {
    "name": "assert",
    "code": "S101",
    "explanation": "## What it does\nChecks for uses of the `assert` keyword.\n\n## Why is this bad?\nAssertions are removed when Python is run with optimization requested\n(i.e., when the `-O` flag is present), which is a common practice in\nproduction environments. As such, assertions should not be used for runtime\nvalidation of user input or to enforce  interface constraints.\n\nConsider raising a meaningful error instead of using `assert`.\n\n## Example\n```python\nassert x > 0, \"Expected positive value.\"\n```\n\nUse instead:\n```python\nif not x > 0:\n    raise ValueError(\"Expected positive value.\")\n\n# or even better:\nif x <= 0:\n    raise ValueError(\"Expected positive value.\")\n```\n"
  },
  {
    "name": "exec-builtin",
    "code": "S102",
    "explanation": "## What it does\nChecks for uses of the builtin `exec` function.\n\n## Why is this bad?\nThe `exec()` function is insecure as it allows for arbitrary code\nexecution.\n\n## Example\n```python\nexec(\"print('Hello World')\")\n```\n\n## References\n- [Python documentation: `exec`](https://docs.python.org/3/library/functions.html#exec)\n- [Common Weakness Enumeration: CWE-78](https://cwe.mitre.org/data/definitions/78.html)\n"
  },
  {
    "name": "bad-file-permissions",
    "code": "S103",
    "explanation": "## What it does\nChecks for files with overly permissive permissions.\n\n## Why is this bad?\nOverly permissive file permissions may allow unintended access and\narbitrary code execution.\n\n## Example\n```python\nimport os\n\nos.chmod(\"/etc/secrets.txt\", 0o666)  # rw-rw-rw-\n```\n\nUse instead:\n```python\nimport os\n\nos.chmod(\"/etc/secrets.txt\", 0o600)  # rw-------\n```\n\n## References\n- [Python documentation: `os.chmod`](https://docs.python.org/3/library/os.html#os.chmod)\n- [Python documentation: `stat`](https://docs.python.org/3/library/stat.html)\n- [Common Weakness Enumeration: CWE-732](https://cwe.mitre.org/data/definitions/732.html)\n"
  },
  {
    "name": "hardcoded-bind-all-interfaces",
    "code": "S104",
    "explanation": "## What it does\nChecks for hardcoded bindings to all network interfaces (`0.0.0.0`).\n\n## Why is this bad?\nBinding to all network interfaces is insecure as it allows access from\nunintended interfaces, which may be poorly secured or unauthorized.\n\nInstead, bind to specific interfaces.\n\n## Example\n```python\nALLOWED_HOSTS = [\"0.0.0.0\"]\n```\n\nUse instead:\n```python\nALLOWED_HOSTS = [\"127.0.0.1\", \"localhost\"]\n```\n\n## References\n- [Common Weakness Enumeration: CWE-200](https://cwe.mitre.org/data/definitions/200.html)\n"
  },
  {
    "name": "hardcoded-password-string",
    "code": "S105",
    "explanation": "## What it does\nChecks for potential uses of hardcoded passwords in strings.\n\n## Why is this bad?\nIncluding a hardcoded password in source code is a security risk, as an\nattacker could discover the password and use it to gain unauthorized\naccess.\n\nInstead, store passwords and other secrets in configuration files,\nenvironment variables, or other sources that are excluded from version\ncontrol.\n\n## Example\n```python\nSECRET_KEY = \"hunter2\"\n```\n\nUse instead:\n```python\nimport os\n\nSECRET_KEY = os.environ[\"SECRET_KEY\"]\n```\n\n## References\n- [Common Weakness Enumeration: CWE-259](https://cwe.mitre.org/data/definitions/259.html)\n"
  },
  {
    "name": "hardcoded-password-func-arg",
    "code": "S106",
    "explanation": "## What it does\nChecks for potential uses of hardcoded passwords in function calls.\n\n## Why is this bad?\nIncluding a hardcoded password in source code is a security risk, as an\nattacker could discover the password and use it to gain unauthorized\naccess.\n\nInstead, store passwords and other secrets in configuration files,\nenvironment variables, or other sources that are excluded from version\ncontrol.\n\n## Example\n```python\nconnect_to_server(password=\"hunter2\")\n```\n\nUse instead:\n```python\nimport os\n\nconnect_to_server(password=os.environ[\"PASSWORD\"])\n```\n\n## References\n- [Common Weakness Enumeration: CWE-259](https://cwe.mitre.org/data/definitions/259.html)\n"
  },
  {
    "name": "hardcoded-password-default",
    "code": "S107",
    "explanation": "## What it does\nChecks for potential uses of hardcoded passwords in function argument\ndefaults.\n\n## Why is this bad?\nIncluding a hardcoded password in source code is a security risk, as an\nattacker could discover the password and use it to gain unauthorized\naccess.\n\nInstead, store passwords and other secrets in configuration files,\nenvironment variables, or other sources that are excluded from version\ncontrol.\n\n## Example\n\n```python\ndef connect_to_server(password=\"hunter2\"): ...\n```\n\nUse instead:\n\n```python\nimport os\n\n\ndef connect_to_server(password=os.environ[\"PASSWORD\"]): ...\n```\n\n## References\n- [Common Weakness Enumeration: CWE-259](https://cwe.mitre.org/data/definitions/259.html)\n"
  },
  {
    "name": "hardcoded-temp-file",
    "code": "S108",
    "explanation": "## What it does\nChecks for the use of hardcoded temporary file or directory paths.\n\n## Why is this bad?\nThe use of hardcoded paths for temporary files can be insecure. If an\nattacker discovers the location of a hardcoded path, they can replace the\ncontents of the file or directory with a malicious payload.\n\nOther programs may also read or write contents to these hardcoded paths,\ncausing unexpected behavior.\n\n## Example\n```python\nwith open(\"/tmp/foo.txt\", \"w\") as file:\n    ...\n```\n\nUse instead:\n```python\nimport tempfile\n\nwith tempfile.NamedTemporaryFile() as file:\n    ...\n```\n\n## Options\n- `lint.flake8-bandit.hardcoded-tmp-directory`\n- `lint.flake8-bandit.hardcoded-tmp-directory-extend`\n\n## References\n- [Common Weakness Enumeration: CWE-377](https://cwe.mitre.org/data/definitions/377.html)\n- [Common Weakness Enumeration: CWE-379](https://cwe.mitre.org/data/definitions/379.html)\n- [Python documentation: `tempfile`](https://docs.python.org/3/library/tempfile.html)\n"
  },
  {
    "name": "try-except-pass",
    "code": "S110",
    "explanation": "## What it does\nChecks for uses of the `try`-`except`-`pass` pattern.\n\n## Why is this bad?\nThe `try`-`except`-`pass` pattern suppresses all exceptions. Suppressing\nexceptions may hide errors that could otherwise reveal unexpected behavior,\nsecurity vulnerabilities, or malicious activity. Instead, consider logging\nthe exception.\n\n## Example\n```python\ntry:\n    ...\nexcept Exception:\n    pass\n```\n\nUse instead:\n```python\nimport logging\n\ntry:\n    ...\nexcept Exception as exc:\n    logging.exception(\"Exception occurred\")\n```\n\n## References\n- [Common Weakness Enumeration: CWE-703](https://cwe.mitre.org/data/definitions/703.html)\n- [Python documentation: `logging`](https://docs.python.org/3/library/logging.html)\n"
  },
  {
    "name": "try-except-continue",
    "code": "S112",
    "explanation": "## What it does\nChecks for uses of the `try`-`except`-`continue` pattern.\n\n## Why is this bad?\nThe `try`-`except`-`continue` pattern suppresses all exceptions.\nSuppressing exceptions may hide errors that could otherwise reveal\nunexpected behavior, security vulnerabilities, or malicious activity.\nInstead, consider logging the exception.\n\n## Example\n```python\nimport logging\n\nwhile predicate:\n    try:\n        ...\n    except Exception:\n        continue\n```\n\nUse instead:\n```python\nimport logging\n\nwhile predicate:\n    try:\n        ...\n    except Exception as exc:\n        logging.exception(\"Error occurred\")\n```\n\n## References\n- [Common Weakness Enumeration: CWE-703](https://cwe.mitre.org/data/definitions/703.html)\n- [Python documentation: `logging`](https://docs.python.org/3/library/logging.html)\n"
  },
  {
    "name": "request-without-timeout",
    "code": "S113",
    "explanation": "## What it does\nChecks for uses of the Python `requests` or `httpx` module that omit the\n`timeout` parameter.\n\n## Why is this bad?\nThe `timeout` parameter is used to set the maximum time to wait for a\nresponse from the server. By omitting the `timeout` parameter, the program\nmay hang indefinitely while awaiting a response.\n\n## Example\n```python\nimport requests\n\nrequests.get(\"https://www.example.com/\")\n```\n\nUse instead:\n```python\nimport requests\n\nrequests.get(\"https://www.example.com/\", timeout=10)\n```\n\n## References\n- [Requests documentation: Timeouts](https://requests.readthedocs.io/en/latest/user/advanced/#timeouts)\n- [httpx documentation: Timeouts](https://www.python-httpx.org/advanced/timeouts/)\n"
  },
  {
    "name": "flask-debug-true",
    "code": "S201",
    "explanation": "## What it does\nChecks for uses of `debug=True` in Flask.\n\n## Why is this bad?\nEnabling debug mode shows an interactive debugger in the browser if an\nerror occurs, and allows running arbitrary Python code from the browser.\nThis could leak sensitive information, or allow an attacker to run\narbitrary code.\n\n## Example\n```python\nimport flask\n\napp = Flask()\n\napp.run(debug=True)\n```\n\nUse instead:\n```python\nimport flask\n\napp = Flask()\n\napp.run(debug=os.environ[\"ENV\"] == \"dev\")\n```\n\n## References\n- [Flask documentation: Debug Mode](https://flask.palletsprojects.com/en/latest/quickstart/#debug-mode)\n"
  },
  {
    "name": "tarfile-unsafe-members",
    "code": "S202",
    "explanation": "## What it does\nChecks for uses of `tarfile.extractall`.\n\n## Why is this bad?\n\nExtracting archives from untrusted sources without prior inspection is\na security risk, as maliciously crafted archives may contain files that\nwill be written outside of the target directory. For example, the archive\ncould include files with absolute paths (e.g., `/etc/passwd`), or relative\npaths with parent directory references (e.g., `../etc/passwd`).\n\nOn Python 3.12 and later, use `filter='data'` to prevent the most dangerous\nsecurity issues (see: [PEP 706]). On earlier versions, set the `members`\nargument to a trusted subset of the archive's members.\n\n## Example\n```python\nimport tarfile\nimport tempfile\n\ntar = tarfile.open(filename)\ntar.extractall(path=tempfile.mkdtemp())\ntar.close()\n```\n\n## References\n- [Common Weakness Enumeration: CWE-22](https://cwe.mitre.org/data/definitions/22.html)\n- [Python documentation: `TarFile.extractall`](https://docs.python.org/3/library/tarfile.html#tarfile.TarFile.extractall)\n- [Python documentation: Extraction filters](https://docs.python.org/3/library/tarfile.html#tarfile-extraction-filter)\n\n[PEP 706]: https://peps.python.org/pep-0706/#backporting-forward-compatibility\n"
  },
  {
    "name": "suspicious-pickle-usage",
    "code": "S301",
    "explanation": "## What it does\nChecks for calls to `pickle` functions or modules that wrap them.\n\n## Why is this bad?\nDeserializing untrusted data with `pickle` and other deserialization\nmodules is insecure as it can allow for the creation of arbitrary objects,\nwhich can then be used to achieve arbitrary code execution and otherwise\nunexpected behavior.\n\nAvoid deserializing untrusted data with `pickle` and other deserialization\nmodules. Instead, consider safer formats, such as JSON.\n\nIf you must deserialize untrusted data with `pickle`, consider signing the\ndata with a secret key and verifying the signature before deserializing the\npayload, This will prevent an attacker from injecting arbitrary objects\ninto the serialized data.\n\nIn [preview], this rule will also flag references to `pickle` functions.\n\n## Example\n```python\nimport pickle\n\nwith open(\"foo.pickle\", \"rb\") as file:\n    foo = pickle.load(file)\n```\n\nUse instead:\n```python\nimport json\n\nwith open(\"foo.json\", \"rb\") as file:\n    foo = json.load(file)\n```\n\n## References\n- [Python documentation: `pickle` \u2014 Python object serialization](https://docs.python.org/3/library/pickle.html)\n- [Common Weakness Enumeration: CWE-502](https://cwe.mitre.org/data/definitions/502.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-marshal-usage",
    "code": "S302",
    "explanation": "## What it does\nChecks for calls to `marshal` functions.\n\n## Why is this bad?\nDeserializing untrusted data with `marshal` is insecure, as it can allow for\nthe creation of arbitrary objects, which can then be used to achieve\narbitrary code execution and otherwise unexpected behavior.\n\nAvoid deserializing untrusted data with `marshal`. Instead, consider safer\nformats, such as JSON.\n\nIf you must deserialize untrusted data with `marshal`, consider signing the\ndata with a secret key and verifying the signature before deserializing the\npayload. This will prevent an attacker from injecting arbitrary objects\ninto the serialized data.\n\nIn [preview], this rule will also flag references to `marshal` functions.\n\n## Example\n```python\nimport marshal\n\nwith open(\"foo.marshal\", \"rb\") as file:\n    foo = marshal.load(file)\n```\n\nUse instead:\n```python\nimport json\n\nwith open(\"foo.json\", \"rb\") as file:\n    foo = json.load(file)\n```\n\n## References\n- [Python documentation: `marshal` \u2014 Internal Python object serialization](https://docs.python.org/3/library/marshal.html)\n- [Common Weakness Enumeration: CWE-502](https://cwe.mitre.org/data/definitions/502.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-insecure-hash-usage",
    "code": "S303",
    "explanation": "## What it does\nChecks for uses of weak or broken cryptographic hash functions.\n\n## Why is this bad?\nWeak or broken cryptographic hash functions may be susceptible to\ncollision attacks (where two different inputs produce the same hash) or\npre-image attacks (where an attacker can find an input that produces a\ngiven hash). This can lead to security vulnerabilities in applications\nthat rely on these hash functions.\n\nAvoid using weak or broken cryptographic hash functions in security\ncontexts. Instead, use a known secure hash function such as SHA-256.\n\nIn [preview], this rule will also flag references to insecure hash functions.\n\n## Example\n```python\nfrom cryptography.hazmat.primitives import hashes\n\ndigest = hashes.Hash(hashes.MD5())\ndigest.update(b\"Hello, world!\")\ndigest.finalize()\n```\n\nUse instead:\n```python\nfrom cryptography.hazmat.primitives import hashes\n\ndigest = hashes.Hash(hashes.SHA256())\ndigest.update(b\"Hello, world!\")\ndigest.finalize()\n```\n\n## References\n- [Python documentation: `hashlib` \u2014 Secure hashes and message digests](https://docs.python.org/3/library/hashlib.html)\n- [Common Weakness Enumeration: CWE-327](https://cwe.mitre.org/data/definitions/327.html)\n- [Common Weakness Enumeration: CWE-328](https://cwe.mitre.org/data/definitions/328.html)\n- [Common Weakness Enumeration: CWE-916](https://cwe.mitre.org/data/definitions/916.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-insecure-cipher-usage",
    "code": "S304",
    "explanation": "## What it does\nChecks for uses of weak or broken cryptographic ciphers.\n\n## Why is this bad?\nWeak or broken cryptographic ciphers may be susceptible to attacks that\nallow an attacker to decrypt ciphertext without knowing the key or\notherwise compromise the security of the cipher, such as forgeries.\n\nUse strong, modern cryptographic ciphers instead of weak or broken ones.\n\nIn [preview], this rule will also flag references to insecure ciphers.\n\n## Example\n```python\nfrom cryptography.hazmat.primitives.ciphers import Cipher, algorithms\n\nalgorithm = algorithms.ARC4(key)\ncipher = Cipher(algorithm, mode=None)\nencryptor = cipher.encryptor()\n```\n\nUse instead:\n```python\nfrom cryptography.fernet import Fernet\n\nfernet = Fernet(key)\n```\n\n## References\n- [Common Weakness Enumeration: CWE-327](https://cwe.mitre.org/data/definitions/327.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-insecure-cipher-mode-usage",
    "code": "S305",
    "explanation": "## What it does\nChecks for uses of weak or broken cryptographic cipher modes.\n\n## Why is this bad?\nWeak or broken cryptographic ciphers may be susceptible to attacks that\nallow an attacker to decrypt ciphertext without knowing the key or\notherwise compromise the security of the cipher, such as forgeries.\n\nUse strong, modern cryptographic ciphers instead of weak or broken ones.\n\nIn [preview], this rule will also flag references to insecure cipher modes.\n\n## Example\n```python\nfrom cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\n\nalgorithm = algorithms.ARC4(key)\ncipher = Cipher(algorithm, mode=modes.ECB(iv))\nencryptor = cipher.encryptor()\n```\n\nUse instead:\n```python\nfrom cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\n\nalgorithm = algorithms.ARC4(key)\ncipher = Cipher(algorithm, mode=modes.CTR(iv))\nencryptor = cipher.encryptor()\n```\n\n## References\n- [Common Weakness Enumeration: CWE-327](https://cwe.mitre.org/data/definitions/327.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-mktemp-usage",
    "code": "S306",
    "explanation": "## What it does\nChecks for uses of `tempfile.mktemp`.\n\n## Why is this bad?\n`tempfile.mktemp` returns a pathname of a file that does not exist at the\ntime the call is made; then, the caller is responsible for creating the\nfile and subsequently using it. This is insecure because another process\ncould create a file with the same name between the time the function\nreturns and the time the caller creates the file.\n\n`tempfile.mktemp` is deprecated in favor of `tempfile.mkstemp` which\ncreates the file when it is called. Consider using `tempfile.mkstemp`\ninstead, either directly or via a context manager such as\n`tempfile.TemporaryFile`.\n\nIn [preview], this rule will also flag references to `tempfile.mktemp`.\n\n## Example\n```python\nimport tempfile\n\ntmp_file = tempfile.mktemp()\nwith open(tmp_file, \"w\") as file:\n    file.write(\"Hello, world!\")\n```\n\nUse instead:\n```python\nimport tempfile\n\nwith tempfile.TemporaryFile() as file:\n    file.write(\"Hello, world!\")\n```\n\n## References\n- [Python documentation:`mktemp`](https://docs.python.org/3/library/tempfile.html#tempfile.mktemp)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-eval-usage",
    "code": "S307",
    "explanation": "## What it does\nChecks for uses of the builtin `eval()` function.\n\n## Why is this bad?\nThe `eval()` function is insecure as it enables arbitrary code execution.\n\nIf you need to evaluate an expression from a string, consider using\n`ast.literal_eval()` instead, which will raise an exception if the\nexpression is not a valid Python literal.\n\nIn [preview], this rule will also flag references to `eval`.\n\n## Example\n```python\nx = eval(input(\"Enter a number: \"))\n```\n\nUse instead:\n```python\nfrom ast import literal_eval\n\nx = literal_eval(input(\"Enter a number: \"))\n```\n\n## References\n- [Python documentation: `eval`](https://docs.python.org/3/library/functions.html#eval)\n- [Python documentation: `literal_eval`](https://docs.python.org/3/library/ast.html#ast.literal_eval)\n- [_Eval really is dangerous_ by Ned Batchelder](https://nedbatchelder.com/blog/201206/eval_really_is_dangerous.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-mark-safe-usage",
    "code": "S308",
    "explanation": "## What it does\nChecks for uses of calls to `django.utils.safestring.mark_safe`.\n\n## Why is this bad?\nCross-site scripting (XSS) vulnerabilities allow attackers to execute\narbitrary JavaScript. To guard against XSS attacks, Django templates\nassumes that data is unsafe and automatically escapes malicious strings\nbefore rending them.\n\n`django.utils.safestring.mark_safe` marks a string as safe for use in HTML\ntemplates, bypassing XSS protection. This is dangerous because it may allow\ncross-site scripting attacks if the string is not properly escaped.\n\nIn [preview], this rule will also flag references to `django.utils.safestring.mark_safe`.\n\n## Example\n```python\nfrom django.utils.safestring import mark_safe\n\ncontent = mark_safe(\"<script>alert('Hello, world!')</script>\")  # XSS.\n```\n\nUse instead:\n```python\ncontent = \"<script>alert('Hello, world!')</script>\"  # Safe if rendered.\n```\n\n## References\n- [Django documentation: `mark_safe`](https://docs.djangoproject.com/en/dev/ref/utils/#django.utils.safestring.mark_safe)\n- [Django documentation: Cross Site Scripting (XSS) protection](https://docs.djangoproject.com/en/dev/topics/security/#cross-site-scripting-xss-protection)\n- [Common Weakness Enumeration: CWE-80](https://cwe.mitre.org/data/definitions/80.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-url-open-usage",
    "code": "S310",
    "explanation": "## What it does\nChecks for instances where URL open functions are used with unexpected schemes.\n\n## Why is this bad?\nSome URL open functions allow the use of `file:` or custom schemes (for use\ninstead of `http:` or `https:`). An attacker may be able to use these\nschemes to access or modify unauthorized resources, and cause unexpected\nbehavior.\n\nTo mitigate this risk, audit all uses of URL open functions and ensure that\nonly permitted schemes are used (e.g., allowing `http:` and `https:`, and\ndisallowing `file:` and `ftp:`).\n\nIn [preview], this rule will also flag references to URL open functions.\n\n## Example\n```python\nfrom urllib.request import urlopen\n\nurl = input(\"Enter a URL: \")\n\nwith urlopen(url) as response:\n    ...\n```\n\nUse instead:\n```python\nfrom urllib.request import urlopen\n\nurl = input(\"Enter a URL: \")\n\nif not url.startswith((\"http:\", \"https:\")):\n    raise ValueError(\"URL must start with 'http:' or 'https:'\")\n\nwith urlopen(url) as response:\n    ...\n```\n\n## References\n- [Python documentation: `urlopen`](https://docs.python.org/3/library/urllib.request.html#urllib.request.urlopen)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-non-cryptographic-random-usage",
    "code": "S311",
    "explanation": "## What it does\nChecks for uses of cryptographically weak pseudo-random number generators.\n\n## Why is this bad?\nCryptographically weak pseudo-random number generators are insecure, as they\nare easily predictable. This can allow an attacker to guess the generated\nnumbers and compromise the security of the system.\n\nInstead, use a cryptographically secure pseudo-random number generator\n(such as using the [`secrets` module](https://docs.python.org/3/library/secrets.html))\nwhen generating random numbers for security purposes.\n\nIn [preview], this rule will also flag references to these generators.\n\n## Example\n```python\nimport random\n\nrandom.randrange(10)\n```\n\nUse instead:\n```python\nimport secrets\n\nsecrets.randbelow(10)\n```\n\n## References\n- [Python documentation: `random` \u2014 Generate pseudo-random numbers](https://docs.python.org/3/library/random.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-telnet-usage",
    "code": "S312",
    "explanation": "## What it does\nChecks for the use of Telnet-related functions.\n\n## Why is this bad?\nTelnet is considered insecure because it does not encrypt data sent over\nthe connection and is vulnerable to numerous attacks.\n\nInstead, consider using a more secure protocol such as SSH.\n\nIn [preview], this rule will also flag references to Telnet-related functions.\n\n## References\n- [Python documentation: `telnetlib` \u2014 Telnet client](https://docs.python.org/3/library/telnetlib.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-xmlc-element-tree-usage",
    "code": "S313",
    "explanation": "## What it does\nChecks for uses of insecure XML parsers.\n\n## Why is this bad?\nMany XML parsers are vulnerable to XML attacks (such as entity expansion),\nwhich cause excessive memory and CPU usage by exploiting recursion. An\nattacker could use such methods to access unauthorized resources.\n\nConsider using the `defusedxml` package when parsing untrusted XML data,\nto protect against XML attacks.\n\nIn [preview], this rule will also flag references to insecure XML parsers.\n\n## Example\n```python\nfrom xml.etree.cElementTree import parse\n\ntree = parse(\"untrusted.xml\")  # Vulnerable to XML attacks.\n```\n\nUse instead:\n```python\nfrom defusedxml.cElementTree import parse\n\ntree = parse(\"untrusted.xml\")\n```\n\n## References\n- [Python documentation: `xml` \u2014 XML processing modules](https://docs.python.org/3/library/xml.html)\n- [PyPI: `defusedxml`](https://pypi.org/project/defusedxml/)\n- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)\n- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-xml-element-tree-usage",
    "code": "S314",
    "explanation": "## What it does\nChecks for uses of insecure XML parsers.\n\n## Why is this bad?\nMany XML parsers are vulnerable to XML attacks (such as entity expansion),\nwhich cause excessive memory and CPU usage by exploiting recursion. An\nattacker could use such methods to access unauthorized resources.\n\nConsider using the `defusedxml` package when parsing untrusted XML data,\nto protect against XML attacks.\n\nIn [preview], this rule will also flag references to insecure XML parsers.\n\n## Example\n```python\nfrom xml.etree.ElementTree import parse\n\ntree = parse(\"untrusted.xml\")  # Vulnerable to XML attacks.\n```\n\nUse instead:\n```python\nfrom defusedxml.ElementTree import parse\n\ntree = parse(\"untrusted.xml\")\n```\n\n## References\n- [Python documentation: `xml` \u2014 XML processing modules](https://docs.python.org/3/library/xml.html)\n- [PyPI: `defusedxml`](https://pypi.org/project/defusedxml/)\n- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)\n- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-xml-expat-reader-usage",
    "code": "S315",
    "explanation": "## What it does\nChecks for uses of insecure XML parsers.\n\n## Why is this bad?\nMany XML parsers are vulnerable to XML attacks (such as entity expansion),\nwhich cause excessive memory and CPU usage by exploiting recursion. An\nattacker could use such methods to access unauthorized resources.\n\nConsider using the `defusedxml` package when parsing untrusted XML data,\nto protect against XML attacks.\n\nIn [preview], this rule will also flag references to insecure XML parsers.\n\n## Example\n```python\nfrom xml.sax.expatreader import create_parser\n\nparser = create_parser()\n```\n\nUse instead:\n```python\nfrom defusedxml.sax import create_parser\n\nparser = create_parser()\n```\n\n## References\n- [Python documentation: `xml` \u2014 XML processing modules](https://docs.python.org/3/library/xml.html)\n- [PyPI: `defusedxml`](https://pypi.org/project/defusedxml/)\n- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)\n- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-xml-expat-builder-usage",
    "code": "S316",
    "explanation": "## What it does\nChecks for uses of insecure XML parsers.\n\n## Why is this bad?\nMany XML parsers are vulnerable to XML attacks (such as entity expansion),\nwhich cause excessive memory and CPU usage by exploiting recursion. An\nattacker could use such methods to access unauthorized resources.\n\nConsider using the `defusedxml` package when parsing untrusted XML data,\nto protect against XML attacks.\n\nIn [preview], this rule will also flag references to insecure XML parsers.\n\n## Example\n```python\nfrom xml.dom.expatbuilder import parse\n\nparse(\"untrusted.xml\")\n```\n\nUse instead:\n```python\nfrom defusedxml.expatbuilder import parse\n\ntree = parse(\"untrusted.xml\")\n```\n\n## References\n- [Python documentation: `xml` \u2014 XML processing modules](https://docs.python.org/3/library/xml.html)\n- [PyPI: `defusedxml`](https://pypi.org/project/defusedxml/)\n- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)\n- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-xml-sax-usage",
    "code": "S317",
    "explanation": "## What it does\nChecks for uses of insecure XML parsers.\n\n## Why is this bad?\nMany XML parsers are vulnerable to XML attacks (such as entity expansion),\nwhich cause excessive memory and CPU usage by exploiting recursion. An\nattacker could use such methods to access unauthorized resources.\n\nConsider using the `defusedxml` package when parsing untrusted XML data,\nto protect against XML attacks.\n\nIn [preview], this rule will also flag references to insecure XML parsers.\n\n## Example\n```python\nfrom xml.sax import make_parser\n\nmake_parser()\n```\n\nUse instead:\n```python\nfrom defusedxml.sax import make_parser\n\nmake_parser()\n```\n\n## References\n- [Python documentation: `xml` \u2014 XML processing modules](https://docs.python.org/3/library/xml.html)\n- [PyPI: `defusedxml`](https://pypi.org/project/defusedxml/)\n- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)\n- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-xml-mini-dom-usage",
    "code": "S318",
    "explanation": "## What it does\nChecks for uses of insecure XML parsers.\n\n## Why is this bad?\nMany XML parsers are vulnerable to XML attacks (such as entity expansion),\nwhich cause excessive memory and CPU usage by exploiting recursion. An\nattacker could use such methods to access unauthorized resources.\n\nConsider using the `defusedxml` package when parsing untrusted XML data,\nto protect against XML attacks.\n\nIn [preview], this rule will also flag references to insecure XML parsers.\n\n## Example\n```python\nfrom xml.dom.minidom import parse\n\ncontent = parse(\"untrusted.xml\")\n```\n\nUse instead:\n```python\nfrom defusedxml.minidom import parse\n\ncontent = parse(\"untrusted.xml\")\n```\n\n## References\n- [Python documentation: `xml` \u2014 XML processing modules](https://docs.python.org/3/library/xml.html)\n- [PyPI: `defusedxml`](https://pypi.org/project/defusedxml/)\n- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)\n- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-xml-pull-dom-usage",
    "code": "S319",
    "explanation": "## What it does\nChecks for uses of insecure XML parsers.\n\n## Why is this bad?\nMany XML parsers are vulnerable to XML attacks (such as entity expansion),\nwhich cause excessive memory and CPU usage by exploiting recursion. An\nattacker could use such methods to access unauthorized resources.\n\nConsider using the `defusedxml` package when parsing untrusted XML data,\nto protect against XML attacks.\n\nIn [preview], this rule will also flag references to insecure XML parsers.\n\n## Example\n```python\nfrom xml.dom.pulldom import parse\n\ncontent = parse(\"untrusted.xml\")\n```\n\nUse instead:\n```python\nfrom defusedxml.pulldom import parse\n\ncontent = parse(\"untrusted.xml\")\n```\n\n## References\n- [Python documentation: `xml` \u2014 XML processing modules](https://docs.python.org/3/library/xml.html)\n- [PyPI: `defusedxml`](https://pypi.org/project/defusedxml/)\n- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)\n- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-xmle-tree-usage",
    "code": "S320",
    "explanation": "## Deprecation\n\nThis rule was deprecated as the `lxml` library has been modified to address\nknown vulnerabilities and unsafe defaults. As such, the `defusedxml`\nlibrary is no longer necessary, `defusedxml` has [deprecated] its `lxml`\nmodule.\n\n## What it does\nChecks for uses of insecure XML parsers.\n\n## Why is this bad?\nMany XML parsers are vulnerable to XML attacks (such as entity expansion),\nwhich cause excessive memory and CPU usage by exploiting recursion. An\nattacker could use such methods to access unauthorized resources.\n\nIn [preview], this rule will also flag references to insecure XML parsers.\n\n## Example\n```python\nfrom lxml import etree\n\ncontent = etree.parse(\"untrusted.xml\")\n```\n\n## References\n- [PyPI: `lxml`](https://pypi.org/project/lxml/)\n- [Common Weakness Enumeration: CWE-400](https://cwe.mitre.org/data/definitions/400.html)\n- [Common Weakness Enumeration: CWE-776](https://cwe.mitre.org/data/definitions/776.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n[deprecated]: https://pypi.org/project/defusedxml/0.8.0rc2/#defusedxml-lxml\n"
  },
  {
    "name": "suspicious-ftp-lib-usage",
    "code": "S321",
    "explanation": "## What it does\nChecks for the use of FTP-related functions.\n\n## Why is this bad?\nFTP is considered insecure as it does not encrypt data sent over the\nconnection and is thus vulnerable to numerous attacks.\n\nInstead, consider using FTPS (which secures FTP using SSL/TLS) or SFTP.\n\nIn [preview], this rule will also flag references to FTP-related functions.\n\n## References\n- [Python documentation: `ftplib` \u2014 FTP protocol client](https://docs.python.org/3/library/ftplib.html)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "suspicious-unverified-context-usage",
    "code": "S323",
    "explanation": "## What it does\nChecks for uses of `ssl._create_unverified_context`.\n\n## Why is this bad?\n[PEP 476] enabled certificate and hostname validation by default in Python\nstandard library HTTP clients. Previously, Python did not validate\ncertificates by default, which could allow an attacker to perform a \"man in\nthe middle\" attack by intercepting and modifying traffic between client and\nserver.\n\nTo support legacy environments, `ssl._create_unverified_context` reverts to\nthe previous behavior that does perform verification. Otherwise, use\n`ssl.create_default_context` to create a secure context.\n\nIn [preview], this rule will also flag references to `ssl._create_unverified_context`.\n\n## Example\n```python\nimport ssl\n\ncontext = ssl._create_unverified_context()\n```\n\nUse instead:\n```python\nimport ssl\n\ncontext = ssl.create_default_context()\n```\n\n## References\n- [PEP 476 \u2013 Enabling certificate verification by default for stdlib http clients: Opting out](https://peps.python.org/pep-0476/#opting-out)\n- [Python documentation: `ssl` \u2014 TLS/SSL wrapper for socket objects](https://docs.python.org/3/library/ssl.html)\n\n[PEP 476]: https://peps.python.org/pep-0476/\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "hashlib-insecure-hash-function",
    "code": "S324",
    "explanation": "## What it does\nChecks for uses of weak or broken cryptographic hash functions in\n`hashlib` and `crypt` libraries.\n\n## Why is this bad?\nWeak or broken cryptographic hash functions may be susceptible to\ncollision attacks (where two different inputs produce the same hash) or\npre-image attacks (where an attacker can find an input that produces a\ngiven hash). This can lead to security vulnerabilities in applications\nthat rely on these hash functions.\n\nAvoid using weak or broken cryptographic hash functions in security\ncontexts. Instead, use a known secure hash function such as SHA256.\n\n## Example\n```python\nimport hashlib\n\n\ndef certificate_is_valid(certificate: bytes, known_hash: str) -> bool:\n    hash = hashlib.md5(certificate).hexdigest()\n    return hash == known_hash\n```\n\nUse instead:\n```python\nimport hashlib\n\n\ndef certificate_is_valid(certificate: bytes, known_hash: str) -> bool:\n    hash = hashlib.sha256(certificate).hexdigest()\n    return hash == known_hash\n```\n\nor add `usedforsecurity=False` if the hashing algorithm is not used in a security context, e.g.\nas a non-cryptographic one-way compression function:\n```python\nimport hashlib\n\n\ndef certificate_is_valid(certificate: bytes, known_hash: str) -> bool:\n    hash = hashlib.md5(certificate, usedforsecurity=False).hexdigest()\n    return hash == known_hash\n```\n\n\n## References\n- [Python documentation: `hashlib` \u2014 Secure hashes and message digests](https://docs.python.org/3/library/hashlib.html)\n- [Python documentation: `crypt` \u2014 Function to check Unix passwords](https://docs.python.org/3/library/crypt.html)\n- [Python documentation: `FIPS` - FIPS compliant hashlib implementation](https://docs.python.org/3/library/hashlib.html#hashlib.algorithms_guaranteed)\n- [Common Weakness Enumeration: CWE-327](https://cwe.mitre.org/data/definitions/327.html)\n- [Common Weakness Enumeration: CWE-328](https://cwe.mitre.org/data/definitions/328.html)\n- [Common Weakness Enumeration: CWE-916](https://cwe.mitre.org/data/definitions/916.html)\n"
  },
  {
    "name": "suspicious-telnetlib-import",
    "code": "S401",
    "explanation": "## What it does\nChecks for imports of the `telnetlib` module.\n\n## Why is this bad?\nTelnet is considered insecure. It is deprecated since version 3.11, and\nwas removed in version 3.13. Instead, use SSH or another encrypted\nprotocol.\n\n## Example\n```python\nimport telnetlib\n```\n\n## References\n- [Python documentation: `telnetlib` - Telnet client](https://docs.python.org/3.12/library/telnetlib.html#module-telnetlib)\n- [PEP 594: `telnetlib`](https://peps.python.org/pep-0594/#telnetlib)\n",
    "preview": true
  },
  {
    "name": "suspicious-ftplib-import",
    "code": "S402",
    "explanation": "## What it does\nChecks for imports of the `ftplib` module.\n\n## Why is this bad?\nFTP is considered insecure. Instead, use SSH, SFTP, SCP, or another\nencrypted protocol.\n\n## Example\n```python\nimport ftplib\n```\n\n## References\n- [Python documentation: `ftplib` - FTP protocol client](https://docs.python.org/3/library/ftplib.html)\n",
    "preview": true
  },
  {
    "name": "suspicious-pickle-import",
    "code": "S403",
    "explanation": "## What it does\nChecks for imports of the `pickle`, `cPickle`, `dill`, and `shelve` modules.\n\n## Why is this bad?\nIt is possible to construct malicious pickle data which will execute\narbitrary code during unpickling. Consider possible security implications\nassociated with these modules.\n\n## Example\n```python\nimport pickle\n```\n\n## References\n- [Python documentation: `pickle` \u2014 Python object serialization](https://docs.python.org/3/library/pickle.html)\n",
    "preview": true
  },
  {
    "name": "suspicious-subprocess-import",
    "code": "S404",
    "explanation": "## What it does\nChecks for imports of the `subprocess` module.\n\n## Why is this bad?\nIt is possible to inject malicious commands into subprocess calls. Consider\npossible security implications associated with this module.\n\n## Example\n```python\nimport subprocess\n```\n",
    "preview": true
  },
  {
    "name": "suspicious-xml-etree-import",
    "code": "S405",
    "explanation": "## What it does\nChecks for imports of the `xml.etree.cElementTree` and `xml.etree.ElementTree` modules\n\n## Why is this bad?\nUsing various methods from these modules to parse untrusted XML data is\nknown to be vulnerable to XML attacks. Replace vulnerable imports with the\nequivalent `defusedxml` package, or make sure `defusedxml.defuse_stdlib()` is\ncalled before parsing XML data.\n\n## Example\n```python\nimport xml.etree.cElementTree\n```\n",
    "preview": true
  },
  {
    "name": "suspicious-xml-sax-import",
    "code": "S406",
    "explanation": "## What it does\nChecks for imports of the `xml.sax` module.\n\n## Why is this bad?\nUsing various methods from these modules to parse untrusted XML data is\nknown to be vulnerable to XML attacks. Replace vulnerable imports with the\nequivalent `defusedxml` package, or make sure `defusedxml.defuse_stdlib()` is\ncalled before parsing XML data.\n\n## Example\n```python\nimport xml.sax\n```\n",
    "preview": true
  },
  {
    "name": "suspicious-xml-expat-import",
    "code": "S407",
    "explanation": "## What it does\nChecks for imports of the `xml.dom.expatbuilder` module.\n\n## Why is this bad?\nUsing various methods from these modules to parse untrusted XML data is\nknown to be vulnerable to XML attacks. Replace vulnerable imports with the\nequivalent `defusedxml` package, or make sure `defusedxml.defuse_stdlib()` is\ncalled before parsing XML data.\n\n## Example\n```python\nimport xml.dom.expatbuilder\n```\n",
    "preview": true
  },
  {
    "name": "suspicious-xml-minidom-import",
    "code": "S408",
    "explanation": "## What it does\nChecks for imports of the `xml.dom.minidom` module.\n\n## Why is this bad?\nUsing various methods from these modules to parse untrusted XML data is\nknown to be vulnerable to XML attacks. Replace vulnerable imports with the\nequivalent `defusedxml` package, or make sure `defusedxml.defuse_stdlib()` is\ncalled before parsing XML data.\n\n## Example\n```python\nimport xml.dom.minidom\n```\n",
    "preview": true
  },
  {
    "name": "suspicious-xml-pulldom-import",
    "code": "S409",
    "explanation": "## What it does\nChecks for imports of the `xml.dom.pulldom` module.\n\n## Why is this bad?\nUsing various methods from these modules to parse untrusted XML data is\nknown to be vulnerable to XML attacks. Replace vulnerable imports with the\nequivalent `defusedxml` package, or make sure `defusedxml.defuse_stdlib()` is\ncalled before parsing XML data.\n\n## Example\n```python\nimport xml.dom.pulldom\n```\n",
    "preview": true
  },
  {
    "name": "suspicious-lxml-import",
    "code": "S410",
    "explanation": "## Removed\nThis rule was removed as the `lxml` library has been modified to address\nknown vulnerabilities and unsafe defaults. As such, the `defusedxml`\nlibrary is no longer necessary, `defusedxml` has [deprecated] its `lxml`\nmodule.\n\n## What it does\nChecks for imports of the `lxml` module.\n\n## Why is this bad?\nUsing various methods from the `lxml` module to parse untrusted XML data is\nknown to be vulnerable to XML attacks. Replace vulnerable imports with the\nequivalent `defusedxml` package.\n\n## Example\n```python\nimport lxml\n```\n\n[deprecated]: https://github.com/tiran/defusedxml/blob/c7445887f5e1bcea470a16f61369d29870cfcfe1/README.md#defusedxmllxml\n"
  },
  {
    "name": "suspicious-xmlrpc-import",
    "code": "S411",
    "explanation": "## What it does\nChecks for imports of the `xmlrpc` module.\n\n## Why is this bad?\nXMLRPC is a particularly dangerous XML module, as it is also concerned with\ncommunicating data over a network. Use the `defused.xmlrpc.monkey_patch()`\nfunction to monkey-patch the `xmlrpclib` module and mitigate remote XML\nattacks.\n\n## Example\n```python\nimport xmlrpc\n```\n",
    "preview": true
  },
  {
    "name": "suspicious-httpoxy-import",
    "code": "S412",
    "explanation": "## What it does\nChecks for imports of `wsgiref.handlers.CGIHandler` and\n`twisted.web.twcgi.CGIScript`.\n\n## Why is this bad?\nhttpoxy is a set of vulnerabilities that affect application code running in\nCGI or CGI-like environments. The use of CGI for web applications should be\navoided to prevent this class of attack.\n\n## Example\n```python\nimport wsgiref.handlers.CGIHandler\n```\n\n## References\n- [httpoxy website](https://httpoxy.org/)\n",
    "preview": true
  },
  {
    "name": "suspicious-pycrypto-import",
    "code": "S413",
    "explanation": "## What it does\nChecks for imports of several unsafe cryptography modules.\n\n## Why is this bad?\nThe `pycrypto` library is known to have a publicly disclosed buffer\noverflow vulnerability. It is no longer actively maintained and has been\ndeprecated in favor of the `pyca/cryptography` library.\n\n## Example\n```python\nimport Crypto.Random\n```\n\n## References\n- [Buffer Overflow Issue](https://github.com/pycrypto/pycrypto/issues/176)\n",
    "preview": true
  },
  {
    "name": "suspicious-pyghmi-import",
    "code": "S415",
    "explanation": "## What it does\nChecks for imports of the `pyghmi` module.\n\n## Why is this bad?\n`pyghmi` is an IPMI-related module, but IPMI is considered insecure.\nInstead, use an encrypted protocol.\n\n## Example\n```python\nimport pyghmi\n```\n\n## References\n- [Buffer Overflow Issue](https://github.com/pycrypto/pycrypto/issues/176)\n",
    "preview": true
  },
  {
    "name": "request-with-no-cert-validation",
    "code": "S501",
    "explanation": "## What it does\nChecks for HTTPS requests that disable SSL certificate checks.\n\n## Why is this bad?\nIf SSL certificates are not verified, an attacker could perform a \"man in\nthe middle\" attack by intercepting and modifying traffic between the client\nand server.\n\n## Example\n```python\nimport requests\n\nrequests.get(\"https://www.example.com\", verify=False)\n```\n\nUse instead:\n```python\nimport requests\n\nrequests.get(\"https://www.example.com\")  # By default, `verify=True`.\n```\n\n## References\n- [Common Weakness Enumeration: CWE-295](https://cwe.mitre.org/data/definitions/295.html)\n"
  },
  {
    "name": "ssl-insecure-version",
    "code": "S502",
    "explanation": "## What it does\nChecks for function calls with parameters that indicate the use of insecure\nSSL and TLS protocol versions.\n\n## Why is this bad?\nSeveral highly publicized exploitable flaws have been discovered in all\nversions of SSL and early versions of TLS. The following versions are\nconsidered insecure, and should be avoided:\n- SSL v2\n- SSL v3\n- TLS v1\n- TLS v1.1\n\nThis method supports detection on the Python's built-in `ssl` module and\nthe `pyOpenSSL` module.\n\n## Example\n```python\nimport ssl\n\nssl.wrap_socket(ssl_version=ssl.PROTOCOL_TLSv1)\n```\n\nUse instead:\n```python\nimport ssl\n\nssl.wrap_socket(ssl_version=ssl.PROTOCOL_TLSv1_2)\n```\n"
  },
  {
    "name": "ssl-with-bad-defaults",
    "code": "S503",
    "explanation": "## What it does\nChecks for function definitions with default arguments set to insecure SSL\nand TLS protocol versions.\n\n## Why is this bad?\nSeveral highly publicized exploitable flaws have been discovered in all\nversions of SSL and early versions of TLS. The following versions are\nconsidered insecure, and should be avoided:\n- SSL v2\n- SSL v3\n- TLS v1\n- TLS v1.1\n\n## Example\n\n```python\nimport ssl\n\n\ndef func(version=ssl.PROTOCOL_TLSv1): ...\n```\n\nUse instead:\n\n```python\nimport ssl\n\n\ndef func(version=ssl.PROTOCOL_TLSv1_2): ...\n```\n"
  },
  {
    "name": "ssl-with-no-version",
    "code": "S504",
    "explanation": "## What it does\nChecks for calls to `ssl.wrap_socket()` without an `ssl_version`.\n\n## Why is this bad?\nThis method is known to provide a default value that maximizes\ncompatibility, but permits use of insecure protocols.\n\n## Example\n```python\nimport ssl\n\nssl.wrap_socket()\n```\n\nUse instead:\n```python\nimport ssl\n\nssl.wrap_socket(ssl_version=ssl.PROTOCOL_TLSv1_2)\n```\n"
  },
  {
    "name": "weak-cryptographic-key",
    "code": "S505",
    "explanation": "## What it does\nChecks for uses of cryptographic keys with vulnerable key sizes.\n\n## Why is this bad?\nSmall keys are easily breakable. For DSA and RSA, keys should be at least\n2048 bits long. For EC, keys should be at least 224 bits long.\n\n## Example\n```python\nfrom cryptography.hazmat.primitives.asymmetric import dsa, ec\n\ndsa.generate_private_key(key_size=512)\nec.generate_private_key(curve=ec.SECT163K1())\n```\n\nUse instead:\n```python\nfrom cryptography.hazmat.primitives.asymmetric import dsa, ec\n\ndsa.generate_private_key(key_size=4096)\nec.generate_private_key(curve=ec.SECP384R1())\n```\n\n## References\n- [CSRC: Transitioning the Use of Cryptographic Algorithms and Key Lengths](https://csrc.nist.gov/pubs/sp/800/131/a/r2/final)\n"
  },
  {
    "name": "unsafe-yaml-load",
    "code": "S506",
    "explanation": "## What it does\nChecks for uses of the `yaml.load` function.\n\n## Why is this bad?\nRunning the `yaml.load` function over untrusted YAML files is insecure, as\n`yaml.load` allows for the creation of arbitrary Python objects, which can\nthen be used to execute arbitrary code.\n\nInstead, consider using `yaml.safe_load`, which allows for the creation of\nsimple Python objects like integers and lists, but prohibits the creation of\nmore complex objects like functions and classes.\n\n## Example\n```python\nimport yaml\n\nyaml.load(untrusted_yaml)\n```\n\nUse instead:\n```python\nimport yaml\n\nyaml.safe_load(untrusted_yaml)\n```\n\n## References\n- [PyYAML documentation: Loading YAML](https://pyyaml.org/wiki/PyYAMLDocumentation)\n- [Common Weakness Enumeration: CWE-20](https://cwe.mitre.org/data/definitions/20.html)\n"
  },
  {
    "name": "ssh-no-host-key-verification",
    "code": "S507",
    "explanation": "## What it does\nChecks for uses of policies disabling SSH verification in Paramiko.\n\n## Why is this bad?\nBy default, Paramiko checks the identity of the remote host when establishing\nan SSH connection. Disabling the verification might lead to the client\nconnecting to a malicious host, without the client knowing.\n\n## Example\n```python\nfrom paramiko import client\n\nssh_client = client.SSHClient()\nssh_client.set_missing_host_key_policy(client.AutoAddPolicy)\n```\n\nUse instead:\n```python\nfrom paramiko import client\n\nssh_client = client.SSHClient()\nssh_client.set_missing_host_key_policy(client.RejectPolicy)\n```\n\n## References\n- [Paramiko documentation: set_missing_host_key_policy](https://docs.paramiko.org/en/latest/api/client.html#paramiko.client.SSHClient.set_missing_host_key_policy)\n"
  },
  {
    "name": "snmp-insecure-version",
    "code": "S508",
    "explanation": "## What it does\nChecks for uses of SNMPv1 or SNMPv2.\n\n## Why is this bad?\nThe SNMPv1 and SNMPv2 protocols are considered insecure as they do\nnot support encryption. Instead, prefer SNMPv3, which supports\nencryption.\n\n## Example\n```python\nfrom pysnmp.hlapi import CommunityData\n\nCommunityData(\"public\", mpModel=0)\n```\n\nUse instead:\n```python\nfrom pysnmp.hlapi import CommunityData\n\nCommunityData(\"public\", mpModel=2)\n```\n\n## References\n- [Cybersecurity and Infrastructure Security Agency (CISA): Alert TA17-156A](https://www.cisa.gov/news-events/alerts/2017/06/05/reducing-risk-snmp-abuse)\n- [Common Weakness Enumeration: CWE-319](https://cwe.mitre.org/data/definitions/319.html)\n"
  },
  {
    "name": "snmp-weak-cryptography",
    "code": "S509",
    "explanation": "## What it does\nChecks for uses of the SNMPv3 protocol without encryption.\n\n## Why is this bad?\nUnencrypted SNMPv3 communication can be intercepted and read by\nunauthorized parties. Instead, enable encryption when using SNMPv3.\n\n## Example\n```python\nfrom pysnmp.hlapi import UsmUserData\n\nUsmUserData(\"user\")\n```\n\nUse instead:\n```python\nfrom pysnmp.hlapi import UsmUserData\n\nUsmUserData(\"user\", \"authkey\", \"privkey\")\n```\n\n## References\n- [Common Weakness Enumeration: CWE-319](https://cwe.mitre.org/data/definitions/319.html)\n"
  },
  {
    "name": "paramiko-call",
    "code": "S601",
    "explanation": "## What it does\nChecks for `paramiko` calls.\n\n## Why is this bad?\n`paramiko` calls allow users to execute arbitrary shell commands on a\nremote machine. If the inputs to these calls are not properly sanitized,\nthey can be vulnerable to shell injection attacks.\n\n## Example\n```python\nimport paramiko\n\nclient = paramiko.SSHClient()\nclient.exec_command(\"echo $HOME\")\n```\n\n## References\n- [Common Weakness Enumeration: CWE-78](https://cwe.mitre.org/data/definitions/78.html)\n- [Paramiko documentation: `SSHClient.exec_command()`](https://docs.paramiko.org/en/stable/api/client.html#paramiko.client.SSHClient.exec_command)\n"
  },
  {
    "name": "subprocess-popen-with-shell-equals-true",
    "code": "S602",
    "explanation": "## What it does\nCheck for method calls that initiate a subprocess with a shell.\n\n## Why is this bad?\nStarting a subprocess with a shell can allow attackers to execute arbitrary\nshell commands. Consider starting the process without a shell call and\nsanitize the input to mitigate the risk of shell injection.\n\n## Example\n```python\nimport subprocess\n\nsubprocess.run(\"ls -l\", shell=True)\n```\n\nUse instead:\n```python\nimport subprocess\n\nsubprocess.run([\"ls\", \"-l\"])\n```\n\n## References\n- [Python documentation: `subprocess` \u2014 Subprocess management](https://docs.python.org/3/library/subprocess.html)\n- [Common Weakness Enumeration: CWE-78](https://cwe.mitre.org/data/definitions/78.html)\n"
  },
  {
    "name": "subprocess-without-shell-equals-true",
    "code": "S603",
    "explanation": "## What it does\nCheck for method calls that initiate a subprocess without a shell.\n\n## Why is this bad?\nStarting a subprocess without a shell can prevent attackers from executing\narbitrary shell commands; however, it is still error-prone. Consider\nvalidating the input.\n\n## Known problems\nProne to false positives as it is difficult to determine whether the\npassed arguments have been validated ([#4045]).\n\n## Example\n```python\nimport subprocess\n\ncmd = input(\"Enter a command: \").split()\nsubprocess.run(cmd)\n```\n\n## References\n- [Python documentation: `subprocess` \u2014 Subprocess management](https://docs.python.org/3/library/subprocess.html)\n\n[#4045]: https://github.com/astral-sh/ruff/issues/4045\n"
  },
  {
    "name": "call-with-shell-equals-true",
    "code": "S604",
    "explanation": "## What it does\nChecks for method calls that set the `shell` parameter to `true` or another\ntruthy value when invoking a subprocess.\n\n## Why is this bad?\nSetting the `shell` parameter to `true` or another truthy value when\ninvoking a subprocess can introduce security vulnerabilities, as it allows\nshell metacharacters and whitespace to be passed to child processes,\npotentially leading to shell injection attacks.\n\nIt is recommended to avoid using `shell=True` unless absolutely necessary\nand, when used, to ensure that all inputs are properly sanitized and quoted\nto prevent such vulnerabilities.\n\n## Known problems\nProne to false positives as it is triggered on any function call with a\n`shell=True` parameter.\n\n## Example\n```python\nimport subprocess\n\nuser_input = input(\"Enter a command: \")\nsubprocess.run(user_input, shell=True)\n```\n\n## References\n- [Python documentation: Security Considerations](https://docs.python.org/3/library/subprocess.html#security-considerations)\n"
  },
  {
    "name": "start-process-with-a-shell",
    "code": "S605",
    "explanation": "## What it does\nChecks for calls that start a process with a shell, providing guidance on\nwhether the usage is safe or not.\n\n## Why is this bad?\nStarting a process with a shell can introduce security risks, such as\ncode injection vulnerabilities. It's important to be aware of whether the\nusage of the shell is safe or not.\n\nThis rule triggers on functions like `os.system`, `popen`, etc., which\nstart processes with a shell. It evaluates whether the provided command\nis a literal string or an expression. If the command is a literal string,\nit's considered safe. If the command is an expression, it's considered\n(potentially) unsafe.\n\n## Example\n```python\nimport os\n\n# Safe usage (literal string)\ncommand = \"ls -l\"\nos.system(command)\n\n# Potentially unsafe usage (expression)\ncmd = get_user_input()\nos.system(cmd)\n```\n\n## Note\nThe `subprocess` module provides more powerful facilities for spawning new\nprocesses and retrieving their results, and using that module is preferable\nto using `os.system` or similar functions. Consider replacing such usages\nwith `subprocess.call` or related functions.\n\n## References\n- [Python documentation: `subprocess`](https://docs.python.org/3/library/subprocess.html)\n"
  },
  {
    "name": "start-process-with-no-shell",
    "code": "S606",
    "explanation": "## What it does\nChecks for functions that start a process without a shell.\n\n## Why is this bad?\nInvoking any kind of external executable via a function call can pose\nsecurity risks if arbitrary variables are passed to the executable, or if\nthe input is otherwise unsanitised or unvalidated.\n\nThis rule specifically flags functions in the `os` module that spawn\nsubprocesses *without* the use of a shell. Note that these typically pose a\nmuch smaller security risk than subprocesses that are started *with* a\nshell, which are flagged by [`start-process-with-a-shell`][S605] (`S605`).\nThis gives you the option of enabling one rule while disabling the other\nif you decide that the security risk from these functions is acceptable\nfor your use case.\n\n## Example\n```python\nimport os\n\n\ndef insecure_function(arbitrary_user_input: str):\n    os.spawnlp(os.P_NOWAIT, \"/bin/mycmd\", \"mycmd\", arbitrary_user_input)\n```\n\n[S605]: https://docs.astral.sh/ruff/rules/start-process-with-a-shell\n"
  },
  {
    "name": "start-process-with-partial-path",
    "code": "S607",
    "explanation": "## What it does\nChecks for the starting of a process with a partial executable path.\n\n## Why is this bad?\nStarting a process with a partial executable path can allow attackers to\nexecute an arbitrary executable by adjusting the `PATH` environment variable.\nConsider using a full path to the executable instead.\n\n## Example\n```python\nimport subprocess\n\nsubprocess.Popen([\"ruff\", \"check\", \"file.py\"])\n```\n\nUse instead:\n```python\nimport subprocess\n\nsubprocess.Popen([\"/usr/bin/ruff\", \"check\", \"file.py\"])\n```\n\n## References\n- [Python documentation: `subprocess.Popen()`](https://docs.python.org/3/library/subprocess.html#subprocess.Popen)\n- [Common Weakness Enumeration: CWE-426](https://cwe.mitre.org/data/definitions/426.html)\n"
  },
  {
    "name": "hardcoded-sql-expression",
    "code": "S608",
    "explanation": "## What it does\nChecks for strings that resemble SQL statements involved in some form\nstring building operation.\n\n## Why is this bad?\nSQL injection is a common attack vector for web applications. Directly\ninterpolating user input into SQL statements should always be avoided.\nInstead, favor parameterized queries, in which the SQL statement is\nprovided separately from its parameters, as supported by `psycopg3`\nand other database drivers and ORMs.\n\n## Example\n```python\nquery = \"DELETE FROM foo WHERE id = '%s'\" % identifier\n```\n\n## References\n- [B608: Test for SQL injection](https://bandit.readthedocs.io/en/latest/plugins/b608_hardcoded_sql_expressions.html)\n- [psycopg3: Server-side binding](https://www.psycopg.org/psycopg3/docs/basic/from_pg2.html#server-side-binding)\n"
  },
  {
    "name": "unix-command-wildcard-injection",
    "code": "S609",
    "explanation": "## What it does\nChecks for possible wildcard injections in calls to `subprocess.Popen()`.\n\n## Why is this bad?\nWildcard injections can lead to unexpected behavior if unintended files are\nmatched by the wildcard. Consider using a more specific path instead.\n\n## Example\n```python\nimport subprocess\n\nsubprocess.Popen([\"chmod\", \"777\", \"*.py\"])\n```\n\nUse instead:\n```python\nimport subprocess\n\nsubprocess.Popen([\"chmod\", \"777\", \"main.py\"])\n```\n\n## References\n- [Common Weakness Enumeration: CWE-78](https://cwe.mitre.org/data/definitions/78.html)\n"
  },
  {
    "name": "django-extra",
    "code": "S610",
    "explanation": "## What it does\nChecks for uses of Django's `extra` function where one or more arguments\npassed are not literal expressions.\n\n## Why is this bad?\nDjango's `extra` function can be used to execute arbitrary SQL queries,\nwhich can in turn lead to SQL injection vulnerabilities.\n\n## Example\n```python\nfrom django.contrib.auth.models import User\n\n# String interpolation creates a security loophole that could be used\n# for SQL injection:\nUser.objects.all().extra(select={\"test\": \"%secure\" % \"nos\"})\n```\n\nUse instead:\n```python\nfrom django.contrib.auth.models import User\n\n# SQL injection is impossible if all arguments are literal expressions:\nUser.objects.all().extra(select={\"test\": \"secure\"})\n```\n\n## References\n- [Django documentation: SQL injection protection](https://docs.djangoproject.com/en/dev/topics/security/#sql-injection-protection)\n- [Common Weakness Enumeration: CWE-89](https://cwe.mitre.org/data/definitions/89.html)\n"
  },
  {
    "name": "django-raw-sql",
    "code": "S611",
    "explanation": "## What it does\nChecks for uses of Django's `RawSQL` function.\n\n## Why is this bad?\nDjango's `RawSQL` function can be used to execute arbitrary SQL queries,\nwhich can in turn lead to SQL injection vulnerabilities.\n\n## Example\n```python\nfrom django.db.models.expressions import RawSQL\nfrom django.contrib.auth.models import User\n\nUser.objects.annotate(val=RawSQL(\"%s\" % input_param, []))\n```\n\n## References\n- [Django documentation: SQL injection protection](https://docs.djangoproject.com/en/dev/topics/security/#sql-injection-protection)\n- [Common Weakness Enumeration: CWE-89](https://cwe.mitre.org/data/definitions/89.html)\n"
  },
  {
    "name": "logging-config-insecure-listen",
    "code": "S612",
    "explanation": "## What it does\nChecks for insecure `logging.config.listen` calls.\n\n## Why is this bad?\n`logging.config.listen` starts a server that listens for logging\nconfiguration requests. This is insecure, as parts of the configuration are\npassed to the built-in `eval` function, which can be used to execute\narbitrary code.\n\n## Example\n```python\nimport logging\n\nlogging.config.listen(9999)\n```\n\n## References\n- [Python documentation: `logging.config.listen()`](https://docs.python.org/3/library/logging.config.html#logging.config.listen)\n"
  },
  {
    "name": "jinja2-autoescape-false",
    "code": "S701",
    "explanation": "## What it does\nChecks for `jinja2` templates that use `autoescape=False`.\n\n## Why is this bad?\n`jinja2` templates that use `autoescape=False` are vulnerable to cross-site\nscripting (XSS) attacks that allow attackers to execute arbitrary\nJavaScript.\n\nBy default, `jinja2` sets `autoescape` to `False`, so it is important to\nset `autoescape=True` or use the `select_autoescape` function to mitigate\nXSS vulnerabilities.\n\n## Example\n```python\nimport jinja2\n\njinja2.Environment(loader=jinja2.FileSystemLoader(\".\"))\n```\n\nUse instead:\n```python\nimport jinja2\n\njinja2.Environment(loader=jinja2.FileSystemLoader(\".\"), autoescape=True)\n```\n\n## References\n- [Jinja documentation: API](https://jinja.palletsprojects.com/en/latest/api/#autoescaping)\n- [Common Weakness Enumeration: CWE-94](https://cwe.mitre.org/data/definitions/94.html)\n"
  },
  {
    "name": "mako-templates",
    "code": "S702",
    "explanation": "## What it does\nChecks for uses of the `mako` templates.\n\n## Why is this bad?\nMako templates allow HTML and JavaScript rendering by default, and are\ninherently open to XSS attacks. Ensure variables in all templates are\nproperly sanitized via the `n`, `h` or `x` flags (depending on context).\nFor example, to HTML escape the variable `data`, use `${ data |h }`.\n\n## Example\n```python\nfrom mako.template import Template\n\nTemplate(\"hello\")\n```\n\nUse instead:\n```python\nfrom mako.template import Template\n\nTemplate(\"hello |h\")\n```\n\n## References\n- [Mako documentation](https://www.makotemplates.org/)\n- [OpenStack security: Cross site scripting XSS](https://security.openstack.org/guidelines/dg_cross-site-scripting-xss.html)\n- [Common Weakness Enumeration: CWE-80](https://cwe.mitre.org/data/definitions/80.html)\n"
  },
  {
    "name": "unsafe-markup-use",
    "code": "S704",
    "explanation": "## What it does\nChecks for non-literal strings being passed to [`markupsafe.Markup`][markupsafe-markup].\n\n## Why is this bad?\n[`markupsafe.Markup`] does not perform any escaping, so passing dynamic\ncontent, like f-strings, variables or interpolated strings will potentially\nlead to XSS vulnerabilities.\n\nInstead you should interpolate the `Markup` object.\n\nUsing [`lint.flake8-bandit.extend-markup-names`] additional objects can be\ntreated like `Markup`.\n\nThis rule was originally inspired by [flake8-markupsafe] but doesn't carve\nout any exceptions for i18n related calls by default.\n\nYou can use [`lint.flake8-bandit.allowed-markup-calls`] to specify exceptions.\n\n## Example\nGiven:\n```python\nfrom markupsafe import Markup\n\ncontent = \"<script>alert('Hello, world!')</script>\"\nhtml = Markup(f\"<b>{content}</b>\")  # XSS\n```\n\nUse instead:\n```python\nfrom markupsafe import Markup\n\ncontent = \"<script>alert('Hello, world!')</script>\"\nhtml = Markup(\"<b>{}</b>\").format(content)  # Safe\n```\n\nGiven:\n```python\nfrom markupsafe import Markup\n\nlines = [\n    Markup(\"<b>heading</b>\"),\n    \"<script>alert('XSS attempt')</script>\",\n]\nhtml = Markup(\"<br>\".join(lines))  # XSS\n```\n\nUse instead:\n```python\nfrom markupsafe import Markup\n\nlines = [\n    Markup(\"<b>heading</b>\"),\n    \"<script>alert('XSS attempt')</script>\",\n]\nhtml = Markup(\"<br>\").join(lines)  # Safe\n```\n## Options\n- `lint.flake8-bandit.extend-markup-names`\n- `lint.flake8-bandit.allowed-markup-calls`\n\n## References\n- [MarkupSafe on PyPI](https://pypi.org/project/MarkupSafe/)\n- [`markupsafe.Markup` API documentation](https://markupsafe.palletsprojects.com/en/stable/escaping/#markupsafe.Markup)\n\n[markupsafe-markup]: https://markupsafe.palletsprojects.com/en/stable/escaping/#markupsafe.Markup\n[flake8-markupsafe]: https://github.com/vmagamedov/flake8-markupsafe\n"
  },
  {
    "name": "blind-except",
    "code": "BLE001",
    "explanation": "## What it does\nChecks for `except` clauses that catch all exceptions.  This includes\nbare `except`, `except BaseException` and `except Exception`.\n\n\n## Why is this bad?\nOverly broad `except` clauses can lead to unexpected behavior, such as\ncatching `KeyboardInterrupt` or `SystemExit` exceptions that prevent the\nuser from exiting the program.\n\nInstead of catching all exceptions, catch only those that are expected to\nbe raised in the `try` block.\n\n## Example\n```python\ntry:\n    foo()\nexcept BaseException:\n    ...\n```\n\nUse instead:\n```python\ntry:\n    foo()\nexcept FileNotFoundError:\n    ...\n```\n\nExceptions that are re-raised will _not_ be flagged, as they're expected to\nbe caught elsewhere:\n```python\ntry:\n    foo()\nexcept BaseException:\n    raise\n```\n\nExceptions that are logged via `logging.exception()` or `logging.error()`\nwith `exc_info` enabled will _not_ be flagged, as this is a common pattern\nfor propagating exception traces:\n```python\ntry:\n    foo()\nexcept BaseException:\n    logging.exception(\"Something went wrong\")\n```\n\n## References\n- [Python documentation: The `try` statement](https://docs.python.org/3/reference/compound_stmts.html#the-try-statement)\n- [Python documentation: Exception hierarchy](https://docs.python.org/3/library/exceptions.html#exception-hierarchy)\n- [PEP 8: Programming Recommendations on bare `except`](https://peps.python.org/pep-0008/#programming-recommendations)\n"
  },
  {
    "name": "boolean-type-hint-positional-argument",
    "code": "FBT001",
    "explanation": "## What it does\nChecks for the use of boolean positional arguments in function definitions,\nas determined by the presence of a `bool` type hint.\n\n## Why is this bad?\nCalling a function with boolean positional arguments is confusing as the\nmeaning of the boolean value is not clear to the caller and to future\nreaders of the code.\n\nThe use of a boolean will also limit the function to only two possible\nbehaviors, which makes the function difficult to extend in the future.\n\nInstead, consider refactoring into separate implementations for the\n`True` and `False` cases, using an `Enum`, or making the argument a\nkeyword-only argument, to force callers to be explicit when providing\nthe argument.\n\nDunder methods that define operators are exempt from this rule, as are\nsetters and `@override` definitions.\n\nIn [preview], this rule will also flag annotations that include boolean\nvariants, like `bool | int`.\n\n## Example\n\n```python\nfrom math import ceil, floor\n\n\ndef round_number(number: float, up: bool) -> int:\n    return ceil(number) if up else floor(number)\n\n\nround_number(1.5, True)  # What does `True` mean?\nround_number(1.5, False)  # What does `False` mean?\n```\n\nInstead, refactor into separate implementations:\n\n```python\nfrom math import ceil, floor\n\n\ndef round_up(number: float) -> int:\n    return ceil(number)\n\n\ndef round_down(number: float) -> int:\n    return floor(number)\n\n\nround_up(1.5)\nround_down(1.5)\n```\n\nOr, refactor to use an `Enum`:\n\n```python\nfrom enum import Enum\n\n\nclass RoundingMethod(Enum):\n    UP = 1\n    DOWN = 2\n\n\ndef round_number(value: float, method: RoundingMethod) -> float: ...\n```\n\nOr, make the argument a keyword-only argument:\n\n```python\nfrom math import ceil, floor\n\n\ndef round_number(number: float, *, up: bool) -> int:\n    return ceil(number) if up else floor(number)\n\n\nround_number(1.5, up=True)\nround_number(1.5, up=False)\n```\n\n## References\n- [Python documentation: Calls](https://docs.python.org/3/reference/expressions.html#calls)\n- [_How to Avoid \u201cThe Boolean Trap\u201d_ by Adam Johnson](https://adamj.eu/tech/2021/07/10/python-type-hints-how-to-avoid-the-boolean-trap/)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "boolean-default-value-positional-argument",
    "code": "FBT002",
    "explanation": "## What it does\nChecks for the use of boolean positional arguments in function definitions,\nas determined by the presence of a boolean default value.\n\n## Why is this bad?\nCalling a function with boolean positional arguments is confusing as the\nmeaning of the boolean value is not clear to the caller and to future\nreaders of the code.\n\nThe use of a boolean will also limit the function to only two possible\nbehaviors, which makes the function difficult to extend in the future.\n\nInstead, consider refactoring into separate implementations for the\n`True` and `False` cases, using an `Enum`, or making the argument a\nkeyword-only argument, to force callers to be explicit when providing\nthe argument.\n\n## Example\n```python\nfrom math import ceil, floor\n\n\ndef round_number(number, up=True):\n    return ceil(number) if up else floor(number)\n\n\nround_number(1.5, True)  # What does `True` mean?\nround_number(1.5, False)  # What does `False` mean?\n```\n\nInstead, refactor into separate implementations:\n```python\nfrom math import ceil, floor\n\n\ndef round_up(number):\n    return ceil(number)\n\n\ndef round_down(number):\n    return floor(number)\n\n\nround_up(1.5)\nround_down(1.5)\n```\n\nOr, refactor to use an `Enum`:\n```python\nfrom enum import Enum\n\n\nclass RoundingMethod(Enum):\n    UP = 1\n    DOWN = 2\n\n\ndef round_number(value, method):\n    return ceil(number) if method is RoundingMethod.UP else floor(number)\n\n\nround_number(1.5, RoundingMethod.UP)\nround_number(1.5, RoundingMethod.DOWN)\n```\n\nOr, make the argument a keyword-only argument:\n```python\nfrom math import ceil, floor\n\n\ndef round_number(number, *, up=True):\n    return ceil(number) if up else floor(number)\n\n\nround_number(1.5, up=True)\nround_number(1.5, up=False)\n```\n\n## References\n- [Python documentation: Calls](https://docs.python.org/3/reference/expressions.html#calls)\n- [_How to Avoid \u201cThe Boolean Trap\u201d_ by Adam Johnson](https://adamj.eu/tech/2021/07/10/python-type-hints-how-to-avoid-the-boolean-trap/)\n"
  },
  {
    "name": "boolean-positional-value-in-call",
    "code": "FBT003",
    "explanation": "## What it does\nChecks for boolean positional arguments in function calls.\n\nSome functions are whitelisted by default. To extend the list of allowed calls\nconfigure the [`lint.flake8-boolean-trap.extend-allowed-calls`] option.\n\n## Why is this bad?\nCalling a function with boolean positional arguments is confusing as the\nmeaning of the boolean value is not clear to the caller, and to future\nreaders of the code.\n\n## Example\n\n```python\ndef func(flag: bool) -> None: ...\n\n\nfunc(True)\n```\n\nUse instead:\n\n```python\ndef func(flag: bool) -> None: ...\n\n\nfunc(flag=True)\n```\n\n## Options\n- `lint.flake8-boolean-trap.extend-allowed-calls`\n\n## References\n- [Python documentation: Calls](https://docs.python.org/3/reference/expressions.html#calls)\n- [_How to Avoid \u201cThe Boolean Trap\u201d_ by Adam Johnson](https://adamj.eu/tech/2021/07/10/python-type-hints-how-to-avoid-the-boolean-trap/)\n"
  },
  {
    "name": "unary-prefix-increment-decrement",
    "code": "B002",
    "explanation": "## What it does\nChecks for the attempted use of the unary prefix increment (`++`) or\ndecrement operator (`--`).\n\n## Why is this bad?\nPython does not support the unary prefix increment or decrement operator.\nWriting `++n` is equivalent to `+(+(n))` and writing `--n` is equivalent to\n`-(-(n))`. In both cases, it is equivalent to `n`.\n\n## Example\n```python\n++x\n--y\n```\n\nUse instead:\n```python\nx += 1\ny -= 1\n```\n\n## References\n- [Python documentation: Unary arithmetic and bitwise operations](https://docs.python.org/3/reference/expressions.html#unary-arithmetic-and-bitwise-operations)\n- [Python documentation: Augmented assignment statements](https://docs.python.org/3/reference/simple_stmts.html#augmented-assignment-statements)\n"
  },
  {
    "name": "assignment-to-os-environ",
    "code": "B003",
    "explanation": "## What it does\nChecks for assignments to `os.environ`.\n\n## Why is this bad?\nIn Python, `os.environ` is a mapping that represents the environment of the\ncurrent process.\n\nHowever, reassigning to `os.environ` does not clear the environment. Instead,\nit merely updates the `os.environ` for the current process. This can lead to\nunexpected behavior, especially when running the program in a subprocess.\n\nInstead, use `os.environ.clear()` to clear the environment, or use the\n`env` argument of `subprocess.Popen` to pass a custom environment to\na subprocess.\n\n## Example\n```python\nimport os\n\nos.environ = {\"foo\": \"bar\"}\n```\n\nUse instead:\n```python\nimport os\n\nos.environ.clear()\nos.environ[\"foo\"] = \"bar\"\n```\n\n## References\n- [Python documentation: `os.environ`](https://docs.python.org/3/library/os.html#os.environ)\n- [Python documentation: `subprocess.Popen`](https://docs.python.org/3/library/subprocess.html#subprocess.Popen)\n"
  },
  {
    "name": "unreliable-callable-check",
    "code": "B004",
    "explanation": "## What it does\nChecks for uses of `hasattr` to test if an object is callable (e.g.,\n`hasattr(obj, \"__call__\")`).\n\n## Why is this bad?\nUsing `hasattr` is an unreliable mechanism for testing if an object is\ncallable. If `obj` implements a custom `__getattr__`, or if its `__call__`\nis itself not callable, you may get misleading results.\n\nInstead, use `callable(obj)` to test if `obj` is callable.\n\n## Example\n```python\nhasattr(obj, \"__call__\")\n```\n\nUse instead:\n```python\ncallable(obj)\n```\n\n## References\n- [Python documentation: `callable`](https://docs.python.org/3/library/functions.html#callable)\n- [Python documentation: `hasattr`](https://docs.python.org/3/library/functions.html#hasattr)\n- [Python documentation: `__getattr__`](https://docs.python.org/3/reference/datamodel.html#object.__getattr__)\n- [Python documentation: `__call__`](https://docs.python.org/3/reference/datamodel.html#object.__call__)\n",
    "fix": 1
  },
  {
    "name": "strip-with-multi-characters",
    "code": "B005",
    "explanation": "## What it does\nChecks for uses of multi-character strings in `.strip()`, `.lstrip()`, and\n`.rstrip()` calls.\n\n## Why is this bad?\nAll characters in the call to `.strip()`, `.lstrip()`, or `.rstrip()` are\nremoved from the leading and trailing ends of the string. If the string\ncontains multiple characters, the reader may be misled into thinking that\na prefix or suffix is being removed, rather than a set of characters.\n\nIn Python 3.9 and later, you can use `str.removeprefix` and\n`str.removesuffix` to remove an exact prefix or suffix from a string,\nrespectively, which should be preferred when possible.\n\n## Known problems\nAs a heuristic, this rule only flags multi-character strings that contain\nduplicate characters. This allows usages like `.strip(\"xyz\")`, which\nremoves all occurrences of the characters `x`, `y`, and `z` from the\nleading and trailing ends of the string, but not `.strip(\"foo\")`.\n\nThe use of unique, multi-character strings may be intentional and\nconsistent with the intent of `.strip()`, `.lstrip()`, or `.rstrip()`,\nwhile the use of duplicate-character strings is very likely to be a\nmistake.\n\n## Example\n```python\n\"text.txt\".strip(\".txt\")  # \"e\"\n```\n\nUse instead:\n```python\n\"text.txt\".removesuffix(\".txt\")  # \"text\"\n```\n\n## References\n- [Python documentation: `str.strip`](https://docs.python.org/3/library/stdtypes.html#str.strip)\n"
  },
  {
    "name": "mutable-argument-default",
    "code": "B006",
    "explanation": "## What it does\nChecks for uses of mutable objects as function argument defaults.\n\n## Why is this bad?\nFunction defaults are evaluated once, when the function is defined.\n\nThe same mutable object is then shared across all calls to the function.\nIf the object is modified, those modifications will persist across calls,\nwhich can lead to unexpected behavior.\n\nInstead, prefer to use immutable data structures, or take `None` as a\ndefault, and initialize a new mutable object inside the function body\nfor each call.\n\nArguments with immutable type annotations will be ignored by this rule.\nTypes outside of the standard library can be marked as immutable with the\n[`lint.flake8-bugbear.extend-immutable-calls`] configuration option.\n\n## Known problems\nMutable argument defaults can be used intentionally to cache computation\nresults. Replacing the default with `None` or an immutable data structure\ndoes not work for such usages. Instead, prefer the `@functools.lru_cache`\ndecorator from the standard library.\n\n## Example\n```python\ndef add_to_list(item, some_list=[]):\n    some_list.append(item)\n    return some_list\n\n\nl1 = add_to_list(0)  # [0]\nl2 = add_to_list(1)  # [0, 1]\n```\n\nUse instead:\n```python\ndef add_to_list(item, some_list=None):\n    if some_list is None:\n        some_list = []\n    some_list.append(item)\n    return some_list\n\n\nl1 = add_to_list(0)  # [0]\nl2 = add_to_list(1)  # [1]\n```\n\n## Options\n- `lint.flake8-bugbear.extend-immutable-calls`\n\n## References\n- [Python documentation: Default Argument Values](https://docs.python.org/3/tutorial/controlflow.html#default-argument-values)\n",
    "fix": 1
  },
  {
    "name": "unused-loop-control-variable",
    "code": "B007",
    "explanation": "## What it does\nChecks for unused variables in loops (e.g., `for` and `while` statements).\n\n## Why is this bad?\nDefining a variable in a loop statement that is never used can confuse\nreaders.\n\nIf the variable is intended to be unused (e.g., to facilitate\ndestructuring of a tuple or other object), prefix it with an underscore\nto indicate the intent. Otherwise, remove the variable entirely.\n\n## Example\n```python\nfor i, j in foo:\n    bar(i)\n```\n\nUse instead:\n```python\nfor i, _j in foo:\n    bar(i)\n```\n\n## References\n- [PEP 8: Naming Conventions](https://peps.python.org/pep-0008/#naming-conventions)\n",
    "fix": 1
  },
  {
    "name": "function-call-in-default-argument",
    "code": "B008",
    "explanation": "## What it does\nChecks for function calls in default function arguments.\n\n## Why is this bad?\nAny function call that's used in a default argument will only be performed\nonce, at definition time. The returned value will then be reused by all\ncalls to the function, which can lead to unexpected behaviour.\n\nParameters with immutable type annotations will be ignored by this rule.\nThose whose default arguments are `NewType` calls where the original type\nis immutable are also ignored.\n\nCalls and types outside of the standard library can be marked as an exception\nto this rule with the [`lint.flake8-bugbear.extend-immutable-calls`] configuration option.\n\n## Example\n\n```python\ndef create_list() -> list[int]:\n    return [1, 2, 3]\n\n\ndef mutable_default(arg: list[int] = create_list()) -> list[int]:\n    arg.append(4)\n    return arg\n```\n\nUse instead:\n\n```python\ndef better(arg: list[int] | None = None) -> list[int]:\n    if arg is None:\n        arg = create_list()\n\n    arg.append(4)\n    return arg\n```\n\nIf the use of a singleton is intentional, assign the result call to a\nmodule-level variable, and use that variable in the default argument:\n\n```python\nERROR = ValueError(\"Hosts weren't successfully added\")\n\n\ndef add_host(error: Exception = ERROR) -> None: ...\n```\n\n## Options\n- `lint.flake8-bugbear.extend-immutable-calls`\n"
  },
  {
    "name": "get-attr-with-constant",
    "code": "B009",
    "explanation": "## What it does\nChecks for uses of `getattr` that take a constant attribute value as an\nargument (e.g., `getattr(obj, \"foo\")`).\n\n## Why is this bad?\n`getattr` is used to access attributes dynamically. If the attribute is\ndefined as a constant, it is no safer than a typical property access. When\npossible, prefer property access over `getattr` calls, as the former is\nmore concise and idiomatic.\n\n\n## Example\n```python\ngetattr(obj, \"foo\")\n```\n\nUse instead:\n```python\nobj.foo\n```\n\n## References\n- [Python documentation: `getattr`](https://docs.python.org/3/library/functions.html#getattr)\n",
    "fix": 2
  },
  {
    "name": "set-attr-with-constant",
    "code": "B010",
    "explanation": "## What it does\nChecks for uses of `setattr` that take a constant attribute value as an\nargument (e.g., `setattr(obj, \"foo\", 42)`).\n\n## Why is this bad?\n`setattr` is used to set attributes dynamically. If the attribute is\ndefined as a constant, it is no safer than a typical property access. When\npossible, prefer property access over `setattr` calls, as the former is\nmore concise and idiomatic.\n\n## Example\n```python\nsetattr(obj, \"foo\", 42)\n```\n\nUse instead:\n```python\nobj.foo = 42\n```\n\n## References\n- [Python documentation: `setattr`](https://docs.python.org/3/library/functions.html#setattr)\n",
    "fix": 2
  },
  {
    "name": "assert-false",
    "code": "B011",
    "explanation": "## What it does\nChecks for uses of `assert False`.\n\n## Why is this bad?\nPython removes `assert` statements when running in optimized mode\n(`python -O`), making `assert False` an unreliable means of\nraising an `AssertionError`.\n\nInstead, raise an `AssertionError` directly.\n\n## Example\n```python\nassert False\n```\n\nUse instead:\n```python\nraise AssertionError\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as changing an `assert` to a\n`raise` will change the behavior of your program when running in\noptimized mode (`python -O`).\n\n## References\n- [Python documentation: `assert`](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)\n",
    "fix": 2
  },
  {
    "name": "jump-statement-in-finally",
    "code": "B012",
    "explanation": "## What it does\nChecks for `break`, `continue`, and `return` statements in `finally`\nblocks.\n\n## Why is this bad?\nThe use of `break`, `continue`, and `return` statements in `finally` blocks\ncan cause exceptions to be silenced.\n\n`finally` blocks execute regardless of whether an exception is raised. If a\n`break`, `continue`, or `return` statement is reached in a `finally` block,\nany exception raised in the `try` or `except` blocks will be silenced.\n\n## Example\n```python\ndef speed(distance, time):\n    try:\n        return distance / time\n    except ZeroDivisionError:\n        raise ValueError(\"Time cannot be zero\")\n    finally:\n        return 299792458  # `ValueError` is silenced\n```\n\nUse instead:\n```python\ndef speed(distance, time):\n    try:\n        return distance / time\n    except ZeroDivisionError:\n        raise ValueError(\"Time cannot be zero\")\n```\n\n## References\n- [Python documentation: The `try` statement](https://docs.python.org/3/reference/compound_stmts.html#the-try-statement)\n"
  },
  {
    "name": "redundant-tuple-in-exception-handler",
    "code": "B013",
    "explanation": "## What it does\nChecks for single-element tuples in exception handlers (e.g.,\n`except (ValueError,):`).\n\nNote: Single-element tuples consisting of a starred expression\nare allowed.\n\n## Why is this bad?\nA tuple with a single element can be more concisely and idiomatically\nexpressed as a single value.\n\n## Example\n```python\ntry:\n    ...\nexcept (ValueError,):\n    ...\n```\n\nUse instead:\n```python\ntry:\n    ...\nexcept ValueError:\n    ...\n```\n\n## References\n- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)\n",
    "fix": 2
  },
  {
    "name": "duplicate-handler-exception",
    "code": "B014",
    "explanation": "## What it does\nChecks for exception handlers that catch duplicate exceptions.\n\n## Why is this bad?\nIncluding the same exception multiple times in the same handler is redundant,\nas the first exception will catch the exception, making the second exception\nunreachable. The same applies to exception hierarchies, as a handler for a\nparent exception (like `Exception`) will also catch child exceptions (like\n`ValueError`).\n\n## Example\n```python\ntry:\n    ...\nexcept (Exception, ValueError):  # `Exception` includes `ValueError`.\n    ...\n```\n\nUse instead:\n```python\ntry:\n    ...\nexcept Exception:\n    ...\n```\n\n## References\n- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)\n- [Python documentation: Exception hierarchy](https://docs.python.org/3/library/exceptions.html#exception-hierarchy)\n",
    "fix": 2
  },
  {
    "name": "useless-comparison",
    "code": "B015",
    "explanation": "## What it does\nChecks for useless comparisons.\n\n## Why is this bad?\nUseless comparisons have no effect on the program, and are often included\nby mistake. If the comparison is intended to enforce an invariant, prepend\nthe comparison with an `assert`. Otherwise, remove it entirely.\n\n## Example\n```python\nfoo == bar\n```\n\nUse instead:\n```python\nassert foo == bar, \"`foo` and `bar` should be equal.\"\n```\n\n## Notebook behavior\nFor Jupyter Notebooks, this rule is not applied to the last top-level expression in a cell.\nThis is because it's common to have a notebook cell that ends with an expression,\nwhich will result in the `repr` of the evaluated expression being printed as the cell's output.\n\n## References\n- [Python documentation: `assert` statement](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)\n"
  },
  {
    "name": "raise-literal",
    "code": "B016",
    "explanation": "## What it does\nChecks for `raise` statements that raise a literal value.\n\n## Why is this bad?\n`raise` must be followed by an exception instance or an exception class,\nand exceptions must be instances of `BaseException` or a subclass thereof.\nRaising a literal will raise a `TypeError` at runtime.\n\n## Example\n```python\nraise \"foo\"\n```\n\nUse instead:\n```python\nraise Exception(\"foo\")\n```\n\n## References\n- [Python documentation: `raise` statement](https://docs.python.org/3/reference/simple_stmts.html#the-raise-statement)\n"
  },
  {
    "name": "assert-raises-exception",
    "code": "B017",
    "explanation": "## What it does\nChecks for `assertRaises` and `pytest.raises` context managers that catch\n`Exception` or `BaseException`.\n\n## Why is this bad?\nThese forms catch every `Exception`, which can lead to tests passing even\nif, e.g., the code under consideration raises a `SyntaxError` or\n`IndentationError`.\n\nEither assert for a more specific exception (builtin or custom), or use\n`assertRaisesRegex` or `pytest.raises(..., match=<REGEX>)` respectively.\n\n## Example\n```python\nself.assertRaises(Exception, foo)\n```\n\nUse instead:\n```python\nself.assertRaises(SomeSpecificException, foo)\n```\n"
  },
  {
    "name": "useless-expression",
    "code": "B018",
    "explanation": "## What it does\nChecks for useless expressions.\n\n## Why is this bad?\nUseless expressions have no effect on the program, and are often included\nby mistake. Assign a useless expression to a variable, or remove it\nentirely.\n\n## Example\n```python\n1 + 1\n```\n\nUse instead:\n```python\nfoo = 1 + 1\n```\n\n## Notebook behavior\nFor Jupyter Notebooks, this rule is not applied to the last top-level expression in a cell.\nThis is because it's common to have a notebook cell that ends with an expression,\nwhich will result in the `repr` of the evaluated expression being printed as the cell's output.\n\n## Known problems\nThis rule ignores expression types that are commonly used for their side\neffects, such as function calls.\n\nHowever, if a seemingly useless expression (like an attribute access) is\nneeded to trigger a side effect, consider assigning it to an anonymous\nvariable, to indicate that the return value is intentionally ignored.\n\nFor example, given:\n```python\nwith errors.ExceptionRaisedContext():\n    obj.attribute\n```\n\nUse instead:\n```python\nwith errors.ExceptionRaisedContext():\n    _ = obj.attribute\n```\n"
  },
  {
    "name": "cached-instance-method",
    "code": "B019",
    "explanation": "## What it does\nChecks for uses of the `functools.lru_cache` and `functools.cache`\ndecorators on methods.\n\n## Why is this bad?\nUsing the `functools.lru_cache` and `functools.cache` decorators on methods\ncan lead to memory leaks, as the global cache will retain a reference to\nthe instance, preventing it from being garbage collected.\n\nInstead, refactor the method to depend only on its arguments and not on the\ninstance of the class, or use the `@lru_cache` decorator on a function\noutside of the class.\n\nThis rule ignores instance methods on enumeration classes, as enum members\nare singletons.\n\n## Example\n```python\nfrom functools import lru_cache\n\n\ndef square(x: int) -> int:\n    return x * x\n\n\nclass Number:\n    value: int\n\n    @lru_cache\n    def squared(self):\n        return square(self.value)\n```\n\nUse instead:\n```python\nfrom functools import lru_cache\n\n\n@lru_cache\ndef square(x: int) -> int:\n    return x * x\n\n\nclass Number:\n    value: int\n\n    def squared(self):\n        return square(self.value)\n```\n\n## References\n- [Python documentation: `functools.lru_cache`](https://docs.python.org/3/library/functools.html#functools.lru_cache)\n- [Python documentation: `functools.cache`](https://docs.python.org/3/library/functools.html#functools.cache)\n- [don't lru_cache methods!](https://www.youtube.com/watch?v=sVjtp6tGo0g)\n"
  },
  {
    "name": "loop-variable-overrides-iterator",
    "code": "B020",
    "explanation": "## What it does\nChecks for loop control variables that override the loop iterable.\n\n## Why is this bad?\nLoop control variables should not override the loop iterable, as this can\nlead to confusing behavior.\n\nInstead, use a distinct variable name for any loop control variables.\n\n## Example\n```python\nitems = [1, 2, 3]\n\nfor items in items:\n    print(items)\n```\n\nUse instead:\n```python\nitems = [1, 2, 3]\n\nfor item in items:\n    print(item)\n```\n\n## References\n- [Python documentation: The `for` statement](https://docs.python.org/3/reference/compound_stmts.html#the-for-statement)\n"
  },
  {
    "name": "f-string-docstring",
    "code": "B021",
    "explanation": "## What it does\nChecks for docstrings that are written via f-strings.\n\n## Why is this bad?\nPython will interpret the f-string as a joined string, rather than as a\ndocstring. As such, the \"docstring\" will not be accessible via the\n`__doc__` attribute, nor will it be picked up by any automated\ndocumentation tooling.\n\n## Example\n```python\ndef foo():\n    f\"\"\"Not a docstring.\"\"\"\n```\n\nUse instead:\n```python\ndef foo():\n    \"\"\"A docstring.\"\"\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [Python documentation: Formatted string literals](https://docs.python.org/3/reference/lexical_analysis.html#f-strings)\n"
  },
  {
    "name": "useless-contextlib-suppress",
    "code": "B022",
    "explanation": "## What it does\nChecks for `contextlib.suppress` without arguments.\n\n## Why is this bad?\n`contextlib.suppress` is a context manager that suppresses exceptions. It takes,\nas arguments, the exceptions to suppress within the enclosed block. If no\nexceptions are specified, then the context manager won't suppress any\nexceptions, and is thus redundant.\n\nConsider adding exceptions to the `contextlib.suppress` call, or removing the\ncontext manager entirely.\n\n## Example\n```python\nimport contextlib\n\nwith contextlib.suppress():\n    foo()\n```\n\nUse instead:\n```python\nimport contextlib\n\nwith contextlib.suppress(Exception):\n    foo()\n```\n\n## References\n- [Python documentation: `contextlib.suppress`](https://docs.python.org/3/library/contextlib.html#contextlib.suppress)\n"
  },
  {
    "name": "function-uses-loop-variable",
    "code": "B023",
    "explanation": "## What it does\nChecks for function definitions that use a loop variable.\n\n## Why is this bad?\nThe loop variable is not bound in the function definition, so it will always\nhave the value it had in the last iteration when the function is called.\n\nInstead, consider using a default argument to bind the loop variable at\nfunction definition time. Or, use `functools.partial`.\n\n## Example\n```python\nadders = [lambda x: x + i for i in range(3)]\nvalues = [adder(1) for adder in adders]  # [3, 3, 3]\n```\n\nUse instead:\n```python\nadders = [lambda x, i=i: x + i for i in range(3)]\nvalues = [adder(1) for adder in adders]  # [1, 2, 3]\n```\n\nOr:\n```python\nfrom functools import partial\n\nadders = [partial(lambda x, i: x + i, i=i) for i in range(3)]\nvalues = [adder(1) for adder in adders]  # [1, 2, 3]\n```\n\n## References\n- [The Hitchhiker's Guide to Python: Late Binding Closures](https://docs.python-guide.org/writing/gotchas/#late-binding-closures)\n- [Python documentation: `functools.partial`](https://docs.python.org/3/library/functools.html#functools.partial)\n"
  },
  {
    "name": "abstract-base-class-without-abstract-method",
    "code": "B024",
    "explanation": "## What it does\nChecks for abstract classes without abstract methods or properties.\nAnnotated but unassigned class variables are regarded as abstract.\n\n## Why is this bad?\nAbstract base classes are used to define interfaces. If an abstract base\nclass has no abstract methods or properties, you may have forgotten\nto add an abstract method or property to the class,\nor omitted an `@abstractmethod` decorator.\n\nIf the class is _not_ meant to be used as an interface, consider removing\nthe `ABC` base class from the class definition.\n\n## Example\n```python\nfrom abc import ABC\nfrom typing import ClassVar\n\n\nclass Foo(ABC):\n    class_var: ClassVar[str] = \"assigned\"\n\n    def method(self):\n        bar()\n```\n\nUse instead:\n```python\nfrom abc import ABC, abstractmethod\nfrom typing import ClassVar\n\n\nclass Foo(ABC):\n    class_var: ClassVar[str]  # unassigned\n\n    @abstractmethod\n    def method(self):\n        bar()\n```\n\n## References\n- [Python documentation: `abc`](https://docs.python.org/3/library/abc.html)\n- [Python documentation: `typing.ClassVar`](https://docs.python.org/3/library/typing.html#typing.ClassVar)\n"
  },
  {
    "name": "duplicate-try-block-exception",
    "code": "B025",
    "explanation": "## What it does\nChecks for `try-except` blocks with duplicate exception handlers.\n\n## Why is this bad?\nDuplicate exception handlers are redundant, as the first handler will catch\nthe exception, making the second handler unreachable.\n\n## Example\n```python\ntry:\n    ...\nexcept ValueError:\n    ...\nexcept ValueError:\n    ...\n```\n\nUse instead:\n```python\ntry:\n    ...\nexcept ValueError:\n    ...\n```\n\n## References\n- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)\n"
  },
  {
    "name": "star-arg-unpacking-after-keyword-arg",
    "code": "B026",
    "explanation": "## What it does\nChecks for function calls that use star-argument unpacking after providing a\nkeyword argument\n\n## Why is this bad?\nIn Python, you can use star-argument unpacking to pass a list or tuple of\narguments to a function.\n\nProviding a star-argument after a keyword argument can lead to confusing\nbehavior, and is only supported for backwards compatibility.\n\n## Example\n```python\ndef foo(x, y, z):\n    return x, y, z\n\n\nfoo(1, 2, 3)  # (1, 2, 3)\nfoo(1, *[2, 3])  # (1, 2, 3)\n# foo(x=1, *[2, 3])  # TypeError\n# foo(y=2, *[1, 3])  # TypeError\nfoo(z=3, *[1, 2])  # (1, 2, 3)  # No error, but confusing!\n```\n\nUse instead:\n```python\ndef foo(x, y, z):\n    return x, y, z\n\n\nfoo(1, 2, 3)  # (1, 2, 3)\nfoo(x=1, y=2, z=3)  # (1, 2, 3)\nfoo(*[1, 2, 3])  # (1, 2, 3)\nfoo(*[1, 2], 3)  # (1, 2, 3)\n```\n\n## References\n- [Python documentation: Calls](https://docs.python.org/3/reference/expressions.html#calls)\n- [Disallow iterable argument unpacking after a keyword argument?](https://github.com/python/cpython/issues/82741)\n"
  },
  {
    "name": "empty-method-without-abstract-decorator",
    "code": "B027",
    "explanation": "## What it does\nChecks for empty methods in abstract base classes without an abstract\ndecorator.\n\n## Why is this bad?\nEmpty methods in abstract base classes without an abstract decorator may be\nbe indicative of a mistake. If the method is meant to be abstract, add an\n`@abstractmethod` decorator to the method.\n\n## Example\n\n```python\nfrom abc import ABC\n\n\nclass Foo(ABC):\n    def method(self): ...\n```\n\nUse instead:\n\n```python\nfrom abc import ABC, abstractmethod\n\n\nclass Foo(ABC):\n    @abstractmethod\n    def method(self): ...\n```\n\n## References\n- [Python documentation: `abc`](https://docs.python.org/3/library/abc.html)\n"
  },
  {
    "name": "no-explicit-stacklevel",
    "code": "B028",
    "explanation": "## What it does\nChecks for `warnings.warn` calls without an explicit `stacklevel` keyword\nargument.\n\n## Why is this bad?\nThe `warnings.warn` method uses a `stacklevel` of 1 by default, which\nwill output a stack frame of the line on which the \"warn\" method\nis called. Setting it to a higher number will output a stack frame\nfrom higher up the stack.\n\nIt's recommended to use a `stacklevel` of 2 or higher, to give the caller\nmore context about the warning.\n\n## Example\n```python\nwarnings.warn(\"This is a warning\")\n```\n\nUse instead:\n```python\nwarnings.warn(\"This is a warning\", stacklevel=2)\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe because it changes\nthe behavior of the code. Moreover, the fix will assign\na stacklevel of 2, while the user may wish to assign a\nhigher stacklevel to address the diagnostic.\n\n## References\n- [Python documentation: `warnings.warn`](https://docs.python.org/3/library/warnings.html#warnings.warn)\n",
    "fix": 2
  },
  {
    "name": "except-with-empty-tuple",
    "code": "B029",
    "explanation": "## What it does\nChecks for exception handlers that catch an empty tuple.\n\n## Why is this bad?\nAn exception handler that catches an empty tuple will not catch anything,\nand is indicative of a mistake. Instead, add exceptions to the `except`\nclause.\n\n## Example\n```python\ntry:\n    1 / 0\nexcept ():\n    ...\n```\n\nUse instead:\n```python\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    ...\n```\n\n## References\n- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)\n"
  },
  {
    "name": "except-with-non-exception-classes",
    "code": "B030",
    "explanation": "## What it does\nChecks for exception handlers that catch non-exception classes.\n\n## Why is this bad?\nCatching classes that do not inherit from `BaseException` will raise a\n`TypeError`.\n\n## Example\n```python\ntry:\n    1 / 0\nexcept 1:\n    ...\n```\n\nUse instead:\n```python\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    ...\n```\n\n## References\n- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)\n- [Python documentation: Built-in Exceptions](https://docs.python.org/3/library/exceptions.html#built-in-exceptions)\n"
  },
  {
    "name": "reuse-of-groupby-generator",
    "code": "B031",
    "explanation": "## What it does\nChecks for multiple usage of the generator returned from\n`itertools.groupby()`.\n\n## Why is this bad?\nUsing the generator more than once will do nothing on the second usage.\nIf that data is needed later, it should be stored as a list.\n\n## Example:\n```python\nimport itertools\n\nfor name, group in itertools.groupby(data):\n    for _ in range(5):\n        do_something_with_the_group(group)\n```\n\nUse instead:\n```python\nimport itertools\n\nfor name, group in itertools.groupby(data):\n    values = list(group)\n    for _ in range(5):\n        do_something_with_the_group(values)\n```\n"
  },
  {
    "name": "unintentional-type-annotation",
    "code": "B032",
    "explanation": "## What it does\nChecks for the unintentional use of type annotations.\n\n## Why is this bad?\nThe use of a colon (`:`) in lieu of an assignment (`=`) can be syntactically valid, but\nis almost certainly a mistake when used in a subscript or attribute assignment.\n\n## Example\n```python\na[\"b\"]: 1\n```\n\nUse instead:\n```python\na[\"b\"] = 1\n```\n"
  },
  {
    "name": "duplicate-value",
    "code": "B033",
    "explanation": "## What it does\nChecks for set literals that contain duplicate items.\n\n## Why is this bad?\nIn Python, sets are unordered collections of unique elements. Including a\nduplicate item in a set literal is redundant, as the duplicate item will be\nreplaced with a single item at runtime.\n\n## Example\n```python\n{1, 2, 3, 1}\n```\n\nUse instead:\n```python\n{1, 2, 3}\n```\n",
    "fix": 1
  },
  {
    "name": "re-sub-positional-args",
    "code": "B034",
    "explanation": "## What it does\nChecks for calls to `re.sub`, `re.subn`, and `re.split` that pass `count`,\n`maxsplit`, or `flags` as positional arguments.\n\n## Why is this bad?\nPassing `count`, `maxsplit`, or `flags` as positional arguments to\n`re.sub`, `re.subn`, or `re.split` can lead to confusion, as most methods in\nthe `re` module accept `flags` as the third positional argument, while\n`re.sub`, `re.subn`, and `re.split` have different signatures.\n\nInstead, pass `count`, `maxsplit`, and `flags` as keyword arguments.\n\n## Example\n```python\nimport re\n\nre.split(\"pattern\", \"replacement\", 1)\n```\n\nUse instead:\n```python\nimport re\n\nre.split(\"pattern\", \"replacement\", maxsplit=1)\n```\n\n## References\n- [Python documentation: `re.sub`](https://docs.python.org/3/library/re.html#re.sub)\n- [Python documentation: `re.subn`](https://docs.python.org/3/library/re.html#re.subn)\n- [Python documentation: `re.split`](https://docs.python.org/3/library/re.html#re.split)\n"
  },
  {
    "name": "static-key-dict-comprehension",
    "code": "B035",
    "explanation": "## What it does\nChecks for dictionary comprehensions that use a static key, like a string\nliteral or a variable defined outside the comprehension.\n\n## Why is this bad?\nUsing a static key (like a string literal) in a dictionary comprehension\nis usually a mistake, as it will result in a dictionary with only one key,\ndespite the comprehension iterating over multiple values.\n\n## Example\n```python\ndata = [\"some\", \"Data\"]\n{\"key\": value.upper() for value in data}\n```\n\nUse instead:\n```python\ndata = [\"some\", \"Data\"]\n{value: value.upper() for value in data}\n```\n"
  },
  {
    "name": "mutable-contextvar-default",
    "code": "B039",
    "explanation": "## What it does\nChecks for uses of mutable objects as `ContextVar` defaults.\n\n## Why is this bad?\n\nThe `ContextVar` default is evaluated once, when the `ContextVar` is defined.\n\nThe same mutable object is then shared across all `.get()` method calls to\nthe `ContextVar`. If the object is modified, those modifications will persist\nacross calls, which can lead to unexpected behavior.\n\nInstead, prefer to use immutable data structures. Alternatively, take\n`None` as a default, and initialize a new mutable object inside for each\ncall using the `.set()` method.\n\nTypes outside the standard library can be marked as immutable with the\n[`lint.flake8-bugbear.extend-immutable-calls`] configuration option.\n\n## Example\n```python\nfrom contextvars import ContextVar\n\n\ncv: ContextVar[list] = ContextVar(\"cv\", default=[])\n```\n\nUse instead:\n```python\nfrom contextvars import ContextVar\n\n\ncv: ContextVar[list | None] = ContextVar(\"cv\", default=None)\n\n...\n\nif cv.get() is None:\n    cv.set([])\n```\n\n## Options\n- `lint.flake8-bugbear.extend-immutable-calls`\n\n## References\n- [Python documentation: `contextvars` \u2014 Context Variables](https://docs.python.org/3/library/contextvars.html)\n"
  },
  {
    "name": "return-in-generator",
    "code": "B901",
    "explanation": "## What it does\nChecks for `return {value}` statements in functions that also contain `yield`\nor `yield from` statements.\n\n## Why is this bad?\nUsing `return {value}` in a generator function was syntactically invalid in\nPython 2. In Python 3 `return {value}` _can_ be used in a generator; however,\nthe combination of `yield` and `return` can lead to confusing behavior, as\nthe `return` statement will cause the generator to raise `StopIteration`\nwith the value provided, rather than returning the value to the caller.\n\nFor example, given:\n```python\nfrom collections.abc import Iterable\nfrom pathlib import Path\n\n\ndef get_file_paths(file_types: Iterable[str] | None = None) -> Iterable[Path]:\n    dir_path = Path(\".\")\n    if file_types is None:\n        return dir_path.glob(\"*\")\n\n    for file_type in file_types:\n        yield from dir_path.glob(f\"*.{file_type}\")\n```\n\nReaders might assume that `get_file_paths()` would return an iterable of\n`Path` objects in the directory; in reality, though, `list(get_file_paths())`\nevaluates to `[]`, since the `return` statement causes the generator to raise\n`StopIteration` with the value `dir_path.glob(\"*\")`:\n\n```shell\n>>> list(get_file_paths(file_types=[\"cfg\", \"toml\"]))\n[PosixPath('setup.cfg'), PosixPath('pyproject.toml')]\n>>> list(get_file_paths())\n[]\n```\n\nFor intentional uses of `return` in a generator, consider suppressing this\ndiagnostic.\n\n## Example\n```python\nfrom collections.abc import Iterable\nfrom pathlib import Path\n\n\ndef get_file_paths(file_types: Iterable[str] | None = None) -> Iterable[Path]:\n    dir_path = Path(\".\")\n    if file_types is None:\n        return dir_path.glob(\"*\")\n\n    for file_type in file_types:\n        yield from dir_path.glob(f\"*.{file_type}\")\n```\n\nUse instead:\n\n```python\nfrom collections.abc import Iterable\nfrom pathlib import Path\n\n\ndef get_file_paths(file_types: Iterable[str] | None = None) -> Iterable[Path]:\n    dir_path = Path(\".\")\n    if file_types is None:\n        yield from dir_path.glob(\"*\")\n    else:\n        for file_type in file_types:\n            yield from dir_path.glob(f\"*.{file_type}\")\n```\n",
    "preview": true
  },
  {
    "name": "class-as-data-structure",
    "code": "B903",
    "explanation": "## What it does\nChecks for classes that only have a public `__init__` method,\nwithout base classes and decorators.\n\n## Why is this bad?\nClasses with just an `__init__` are possibly better off\nbeing a dataclass or a namedtuple, which have less boilerplate.\n\n## Example\n```python\nclass Point:\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y\n```\n\nUse instead:\n```python\nfrom dataclasses import dataclass\n\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n```\n",
    "preview": true
  },
  {
    "name": "raise-without-from-inside-except",
    "code": "B904",
    "explanation": "## What it does\nChecks for `raise` statements in exception handlers that lack a `from`\nclause.\n\n## Why is this bad?\nIn Python, `raise` can be used with or without an exception from which the\ncurrent exception is derived. This is known as exception chaining. When\nprinting the stack trace, chained exceptions are displayed in such a way\nso as make it easier to trace the exception back to its root cause.\n\nWhen raising an exception from within an `except` clause, always include a\n`from` clause to facilitate exception chaining. If the exception is not\nchained, it will be difficult to trace the exception back to its root cause.\n\n## Example\n```python\ntry:\n    ...\nexcept FileNotFoundError:\n    if ...:\n        raise RuntimeError(\"...\")\n    else:\n        raise UserWarning(\"...\")\n```\n\nUse instead:\n```python\ntry:\n    ...\nexcept FileNotFoundError as exc:\n    if ...:\n        raise RuntimeError(\"...\") from None\n    else:\n        raise UserWarning(\"...\") from exc\n```\n\n## References\n- [Python documentation: `raise` statement](https://docs.python.org/3/reference/simple_stmts.html#the-raise-statement)\n"
  },
  {
    "name": "zip-without-explicit-strict",
    "code": "B905",
    "explanation": "## What it does\nChecks for `zip` calls without an explicit `strict` parameter.\n\n## Why is this bad?\nBy default, if the iterables passed to `zip` are of different lengths, the\nresulting iterator will be silently truncated to the length of the shortest\niterable. This can lead to subtle bugs.\n\nPass `strict=True` to raise a `ValueError` if the iterables are of\nnon-uniform length. Alternatively, if the iterables are deliberately of\ndifferent lengths, pass `strict=False` to make the intention explicit.\n\n## Example\n```python\nzip(a, b)\n```\n\nUse instead:\n```python\nzip(a, b, strict=True)\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe for `zip` calls that contain\n`**kwargs`, as adding a `strict` keyword argument to such a call may lead\nto a duplicate keyword argument error.\n\n## References\n- [Python documentation: `zip`](https://docs.python.org/3/library/functions.html#zip)\n",
    "fix": 2
  },
  {
    "name": "loop-iterator-mutation",
    "code": "B909",
    "explanation": "## What it does\nChecks for mutations to an iterable during a loop iteration.\n\n## Why is this bad?\nWhen iterating over an iterable, mutating the iterable can lead to unexpected\nbehavior, like skipping elements or infinite loops.\n\n## Example\n```python\nitems = [1, 2, 3]\n\nfor item in items:\n    print(item)\n\n    # Create an infinite loop by appending to the list.\n    items.append(item)\n```\n\n## References\n- [Python documentation: Mutable Sequence Types](https://docs.python.org/3/library/stdtypes.html#typesseq-mutable)\n",
    "preview": true
  },
  {
    "name": "batched-without-explicit-strict",
    "code": "B911",
    "explanation": "## What it does\nChecks for `itertools.batched` calls without an explicit `strict` parameter.\n\n## Why is this bad?\nBy default, if the length of the iterable is not divisible by\nthe second argument to `itertools.batched`, the last batch\nwill be shorter than the rest.\n\nIn Python 3.13, a `strict` parameter was added which allows controlling if the batches must be of uniform length.\nPass `strict=True` to raise a `ValueError` if the batches are of non-uniform length.\nOtherwise, pass `strict=False` to make the intention explicit.\n\n## Example\n```python\nitertools.batched(iterable, n)\n```\n\nUse instead if the batches must be of uniform length:\n```python\nitertools.batched(iterable, n, strict=True)\n```\n\nOr if the batches can be of non-uniform length:\n```python\nitertools.batched(iterable, n, strict=False)\n```\n\n## Known deviations\nUnlike the upstream `B911`, this rule will not report infinite iterators\n(e.g., `itertools.cycle(...)`).\n\n## Options\n- `target-version`\n\n## References\n- [Python documentation: `batched`](https://docs.python.org/3/library/itertools.html#batched)\n"
  },
  {
    "name": "builtin-variable-shadowing",
    "code": "A001",
    "explanation": "## What it does\nChecks for variable (and function) assignments that use the same names\nas builtins.\n\n## Why is this bad?\nReusing a builtin name for the name of a variable increases the\ndifficulty of reading and maintaining the code, and can cause\nnon-obvious errors, as readers may mistake the variable for the\nbuiltin and vice versa.\n\nBuiltins can be marked as exceptions to this rule via the\n[`lint.flake8-builtins.ignorelist`] configuration option.\n\n## Example\n```python\ndef find_max(list_of_lists):\n    max = 0\n    for flat_list in list_of_lists:\n        for value in flat_list:\n            max = max(max, value)  # TypeError: 'int' object is not callable\n    return max\n```\n\nUse instead:\n```python\ndef find_max(list_of_lists):\n    result = 0\n    for flat_list in list_of_lists:\n        for value in flat_list:\n            result = max(result, value)\n    return result\n```\n\n## Options\n- `lint.flake8-builtins.ignorelist`\n\n## References\n- [_Why is it a bad idea to name a variable `id` in Python?_](https://stackoverflow.com/questions/77552/id-is-a-bad-variable-name-in-python)\n"
  },
  {
    "name": "builtin-argument-shadowing",
    "code": "A002",
    "explanation": "## What it does\nChecks for function arguments that use the same names as builtins.\n\n## Why is this bad?\nReusing a builtin name for the name of an argument increases the\ndifficulty of reading and maintaining the code, and can cause\nnon-obvious errors, as readers may mistake the argument for the\nbuiltin and vice versa.\n\nBuiltins can be marked as exceptions to this rule via the\n[`lint.flake8-builtins.ignorelist`] configuration option.\n\n## Example\n```python\ndef remove_duplicates(list, list2):\n    result = set()\n    for value in list:\n        result.add(value)\n    for value in list2:\n        result.add(value)\n    return list(result)  # TypeError: 'list' object is not callable\n```\n\nUse instead:\n```python\ndef remove_duplicates(list1, list2):\n    result = set()\n    for value in list1:\n        result.add(value)\n    for value in list2:\n        result.add(value)\n    return list(result)\n```\n\n## Options\n- `lint.flake8-builtins.ignorelist`\n\n## References\n- [_Is it bad practice to use a built-in function name as an attribute or method identifier?_](https://stackoverflow.com/questions/9109333/is-it-bad-practice-to-use-a-built-in-function-name-as-an-attribute-or-method-ide)\n- [_Why is it a bad idea to name a variable `id` in Python?_](https://stackoverflow.com/questions/77552/id-is-a-bad-variable-name-in-python)\n"
  },
  {
    "name": "builtin-attribute-shadowing",
    "code": "A003",
    "explanation": "## What it does\nChecks for class attributes and methods that use the same names as\nPython builtins.\n\n## Why is this bad?\nReusing a builtin name for the name of an attribute increases the\ndifficulty of reading and maintaining the code, and can cause\nnon-obvious errors, as readers may mistake the attribute for the\nbuiltin and vice versa.\n\nSince methods and class attributes typically cannot be referenced directly\nfrom outside the class scope, this rule only applies to those methods\nand attributes that both shadow a builtin _and_ are referenced from within\nthe class scope, as in the following example, where the `list[int]` return\ntype annotation resolves to the `list` method, rather than the builtin:\n\n```python\nclass Class:\n    @staticmethod\n    def list() -> None:\n        pass\n\n    @staticmethod\n    def repeat(value: int, times: int) -> list[int]:\n        return [value] * times\n```\n\nBuiltins can be marked as exceptions to this rule via the\n[`lint.flake8-builtins.ignorelist`] configuration option, or\nconverted to the appropriate dunder method. Methods decorated with\n`@typing.override` or `@typing_extensions.override` are also\nignored.\n\n## Example\n```python\nclass Class:\n    @staticmethod\n    def list() -> None:\n        pass\n\n    @staticmethod\n    def repeat(value: int, times: int) -> list[int]:\n        return [value] * times\n```\n\n## Options\n- `lint.flake8-builtins.ignorelist`\n"
  },
  {
    "name": "builtin-import-shadowing",
    "code": "A004",
    "explanation": "## What it does\nChecks for imports that use the same names as builtins.\n\n## Why is this bad?\nReusing a builtin for the name of an import increases the difficulty\nof reading and maintaining the code, and can cause non-obvious errors,\nas readers may mistake the variable for the builtin and vice versa.\n\nBuiltins can be marked as exceptions to this rule via the\n[`lint.flake8-builtins.ignorelist`] configuration option.\n\n## Example\n```python\nfrom rich import print\n\nprint(\"Some message\")\n```\n\nUse instead:\n```python\nfrom rich import print as rich_print\n\nrich_print(\"Some message\")\n```\n\nor:\n```python\nimport rich\n\nrich.print(\"Some message\")\n```\n\n## Options\n- `lint.flake8-builtins.ignorelist`\n- `target-version`\n\n"
  },
  {
    "name": "stdlib-module-shadowing",
    "code": "A005",
    "explanation": "## What it does\nChecks for modules that use the same names as Python standard-library\nmodules.\n\n## Why is this bad?\nReusing a standard-library module name for the name of a module increases\nthe difficulty of reading and maintaining the code, and can cause\nnon-obvious errors. Readers may mistake the first-party module for the\nstandard-library module and vice versa.\n\nStandard-library modules can be marked as exceptions to this rule via the\n[`lint.flake8-builtins.allowed-modules`] configuration option.\n\nBy default, the module path relative to the project root or [`src`] directories is considered,\nso a top-level `logging.py` or `logging/__init__.py` will clash with the builtin `logging`\nmodule, but `utils/logging.py`, for example, will not. With the\n[`lint.flake8-builtins.strict-checking`] option set to `true`, only the last component\nof the module name is considered, so `logging.py`, `utils/logging.py`, and\n`utils/logging/__init__.py` will all trigger the rule.\n\nThis rule is not applied to stub files, as the name of a stub module is out\nof the control of the author of the stub file. Instead, a stub should aim to\nfaithfully emulate the runtime module it is stubbing.\n\nAs of Python 3.13, errors from modules that use the same name as\nstandard-library modules now display a custom message.\n\n## Example\n\n```console\n$ touch random.py\n$ python3 -c 'from random import choice'\nTraceback (most recent call last):\n  File \"<string>\", line 1, in <module>\n    from random import choice\nImportError: cannot import name 'choice' from 'random' (consider renaming '/random.py' since it has the same name as the standard library module named 'random' and prevents importing that standard library module)\n```\n\n## Options\n- `lint.flake8-builtins.allowed-modules`\n- `lint.flake8-builtins.strict-checking`\n"
  },
  {
    "name": "builtin-lambda-argument-shadowing",
    "code": "A006",
    "explanation": "## What it does\nChecks for lambda arguments that use the same names as Python builtins.\n\n## Why is this bad?\nReusing a builtin name for the name of a lambda argument increases the\ndifficulty of reading and maintaining the code and can cause\nnon-obvious errors. Readers may mistake the variable for the\nbuiltin, and vice versa.\n\nBuiltins can be marked as exceptions to this rule via the\n[`lint.flake8-builtins.ignorelist`] configuration option.\n\n## Options\n- `lint.flake8-builtins.ignorelist`\n"
  },
  {
    "name": "missing-trailing-comma",
    "code": "COM812",
    "explanation": "## What it does\nChecks for the absence of trailing commas.\n\n## Why is this bad?\nThe presence of a trailing comma can reduce diff size when parameters or\nelements are added or removed from function calls, function definitions,\nliterals, etc.\n\n## Example\n```python\nfoo = {\n    \"bar\": 1,\n    \"baz\": 2\n}\n```\n\nUse instead:\n```python\nfoo = {\n    \"bar\": 1,\n    \"baz\": 2,\n}\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent use of trailing commas, making the rule redundant.\n\n[formatter]:https://docs.astral.sh/ruff/formatter/\n",
    "fix": 2
  },
  {
    "name": "trailing-comma-on-bare-tuple",
    "code": "COM818",
    "explanation": "## What it does\nChecks for the presence of trailing commas on bare (i.e., unparenthesized)\ntuples.\n\n## Why is this bad?\nThe presence of a misplaced comma will cause Python to interpret the value\nas a tuple, which can lead to unexpected behaviour.\n\n## Example\n```python\nimport json\n\n\nfoo = json.dumps({\"bar\": 1}),\n```\n\nUse instead:\n```python\nimport json\n\n\nfoo = json.dumps({\"bar\": 1})\n```\n\nIn the event that a tuple is intended, then use instead:\n```python\nimport json\n\n\nfoo = (json.dumps({\"bar\": 1}),)\n```\n"
  },
  {
    "name": "prohibited-trailing-comma",
    "code": "COM819",
    "explanation": "## What it does\nChecks for the presence of prohibited trailing commas.\n\n## Why is this bad?\nTrailing commas are not essential in some cases and can therefore be viewed\nas unnecessary.\n\n## Example\n```python\nfoo = (1, 2, 3,)\n```\n\nUse instead:\n```python\nfoo = (1, 2, 3)\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent use of trailing commas, making the rule redundant.\n\n[formatter]:https://docs.astral.sh/ruff/formatter/\n",
    "fix": 2
  },
  {
    "name": "unnecessary-generator-list",
    "code": "C400",
    "explanation": "## What it does\nChecks for unnecessary generators that can be rewritten as list\ncomprehensions (or with `list()` directly).\n\n## Why is this bad?\nIt is unnecessary to use `list()` around a generator expression, since\nthere are equivalent comprehensions for these types. Using a\ncomprehension is clearer and more idiomatic.\n\nFurther, if the comprehension can be removed entirely, as in the case of\n`list(x for x in foo)`, it's better to use `list(foo)` directly, since it's\neven more direct.\n\n## Example\n```python\nlist(f(x) for x in foo)\nlist(x for x in foo)\nlist((x for x in foo))\n```\n\nUse instead:\n```python\n[f(x) for x in foo]\nlist(foo)\nlist(foo)\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-generator-set",
    "code": "C401",
    "explanation": "## What it does\nChecks for unnecessary generators that can be rewritten as set\ncomprehensions (or with `set()` directly).\n\n## Why is this bad?\nIt is unnecessary to use `set` around a generator expression, since\nthere are equivalent comprehensions for these types. Using a\ncomprehension is clearer and more idiomatic.\n\nFurther, if the comprehension can be removed entirely, as in the case of\n`set(x for x in foo)`, it's better to use `set(foo)` directly, since it's\neven more direct.\n\n## Example\n```python\nset(f(x) for x in foo)\nset(x for x in foo)\nset((x for x in foo))\n```\n\nUse instead:\n```python\n{f(x) for x in foo}\nset(foo)\nset(foo)\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-generator-dict",
    "code": "C402",
    "explanation": "## What it does\nChecks for unnecessary generators that can be rewritten as dict\ncomprehensions.\n\n## Why is this bad?\nIt is unnecessary to use `dict()` around a generator expression, since\nthere are equivalent comprehensions for these types. Using a\ncomprehension is clearer and more idiomatic.\n\n## Example\n```python\ndict((x, f(x)) for x in foo)\n```\n\nUse instead:\n```python\n{x: f(x) for x in foo}\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-list-comprehension-set",
    "code": "C403",
    "explanation": "## What it does\nChecks for unnecessary list comprehensions.\n\n## Why is this bad?\nIt's unnecessary to use a list comprehension inside a call to `set()`,\nsince there is an equivalent comprehension for this type.\n\n## Example\n```python\nset([f(x) for x in foo])\n```\n\nUse instead:\n```python\n{f(x) for x in foo}\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-list-comprehension-dict",
    "code": "C404",
    "explanation": "## What it does\nChecks for unnecessary list comprehensions.\n\n## Why is this bad?\nIt's unnecessary to use a list comprehension inside a call to `dict()`,\nsince there is an equivalent comprehension for this type.\n\n## Example\n```python\ndict([(x, f(x)) for x in foo])\n```\n\nUse instead:\n```python\n{x: f(x) for x in foo}\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-literal-set",
    "code": "C405",
    "explanation": "## What it does\nChecks for `set()` calls that take unnecessary list or tuple literals\nas arguments.\n\n## Why is this bad?\nIt's unnecessary to use a list or tuple literal within a call to `set()`.\nInstead, the expression can be rewritten as a set literal.\n\n## Example\n```python\nset([1, 2])\nset((1, 2))\nset([])\n```\n\nUse instead:\n```python\n{1, 2}\n{1, 2}\nset()\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-literal-dict",
    "code": "C406",
    "explanation": "## What it does\nChecks for unnecessary list or tuple literals.\n\n## Why is this bad?\nIt's unnecessary to use a list or tuple literal within a call to `dict()`.\nIt can be rewritten as a dict literal (`{}`).\n\n## Example\n```python\ndict([(1, 2), (3, 4)])\ndict(((1, 2), (3, 4)))\ndict([])\n```\n\nUse instead:\n```python\n{1: 2, 3: 4}\n{1: 2, 3: 4}\n{}\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-collection-call",
    "code": "C408",
    "explanation": "## What it does\nChecks for unnecessary `dict()`, `list()` or `tuple()` calls that can be\nrewritten as empty literals.\n\n## Why is this bad?\nIt's unnecessary to call, e.g., `dict()` as opposed to using an empty\nliteral (`{}`). The former is slower because the name `dict` must be\nlooked up in the global scope in case it has been rebound.\n\n## Example\n```python\ndict()\ndict(a=1, b=2)\nlist()\ntuple()\n```\n\nUse instead:\n```python\n{}\n{\"a\": 1, \"b\": 2}\n[]\n()\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n\n## Options\n- `lint.flake8-comprehensions.allow-dict-calls-with-keyword-arguments`\n",
    "fix": 2
  },
  {
    "name": "unnecessary-literal-within-tuple-call",
    "code": "C409",
    "explanation": "## What it does\nChecks for `tuple` calls that take unnecessary list or tuple literals as\narguments. In [preview], this also includes unnecessary list comprehensions\nwithin tuple calls.\n\n## Why is this bad?\nIt's unnecessary to use a list or tuple literal within a `tuple()` call,\nsince there is a literal syntax for these types.\n\nIf a list literal was passed, then it should be rewritten as a `tuple`\nliteral. Otherwise, if a tuple literal was passed, then the outer call\nto `tuple()` should be removed.\n\nIn [preview], this rule also checks for list comprehensions within `tuple()`\ncalls. If a list comprehension is found, it should be rewritten as a\ngenerator expression.\n\n## Example\n```python\ntuple([1, 2])\ntuple((1, 2))\ntuple([x for x in range(10)])\n```\n\nUse instead:\n```python\n(1, 2)\n(1, 2)\ntuple(x for x in range(10))\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n\n[preview]: https://docs.astral.sh/ruff/preview/\n",
    "fix": 2
  },
  {
    "name": "unnecessary-literal-within-list-call",
    "code": "C410",
    "explanation": "## What it does\nChecks for `list()` calls that take unnecessary list or tuple literals as\narguments.\n\n## Why is this bad?\nIt's unnecessary to use a list or tuple literal within a `list()` call,\nsince there is a literal syntax for these types.\n\nIf a list literal is passed in, then the outer call to `list()` should be\nremoved. Otherwise, if a tuple literal is passed in, then it should be\nrewritten as a list literal.\n\n## Example\n```python\nlist([1, 2])\nlist((1, 2))\n```\n\nUse instead:\n```python\n[1, 2]\n[1, 2]\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-list-call",
    "code": "C411",
    "explanation": "## What it does\nChecks for unnecessary `list()` calls around list comprehensions.\n\n## Why is this bad?\nIt is redundant to use a `list()` call around a list comprehension.\n\n## Example\n```python\nlist([f(x) for x in foo])\n```\n\nUse instead\n```python\n[f(x) for x in foo]\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-call-around-sorted",
    "code": "C413",
    "explanation": "## What it does\nChecks for unnecessary `list()` or `reversed()` calls around `sorted()`\ncalls.\n\n## Why is this bad?\nIt is unnecessary to use `list()` around `sorted()`, as the latter already\nreturns a list.\n\nIt is also unnecessary to use `reversed()` around `sorted()`, as the latter\nhas a `reverse` argument that can be used in lieu of an additional\n`reversed()` call.\n\nIn both cases, it's clearer and more efficient to avoid the redundant call.\n\n## Example\n```python\nreversed(sorted(iterable))\n```\n\nUse instead:\n```python\nsorted(iterable, reverse=True)\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as `reversed()` and `reverse=True` will\nyield different results in the event of custom sort keys or equality\nfunctions. Specifically, `reversed()` will reverse the order of the\ncollection, while `sorted()` with `reverse=True` will perform a stable\nreverse sort, which will preserve the order of elements that compare as\nequal.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-double-cast-or-process",
    "code": "C414",
    "explanation": "## What it does\nChecks for unnecessary `list()`, `reversed()`, `set()`, `sorted()`, and\n`tuple()` call within `list()`, `set()`, `sorted()`, and `tuple()` calls.\n\n## Why is this bad?\nIt's unnecessary to double-cast or double-process iterables by wrapping\nthe listed functions within an additional `list()`, `set()`, `sorted()`, or\n`tuple()` call. Doing so is redundant and can be confusing for readers.\n\n## Example\n```python\nlist(tuple(iterable))\n```\n\nUse instead:\n```python\nlist(iterable)\n```\n\nThis rule applies to a variety of functions, including `list()`, `reversed()`,\n`set()`, `sorted()`, and `tuple()`. For example:\n\n- Instead of `list(list(iterable))`, use `list(iterable)`.\n- Instead of `list(tuple(iterable))`, use `list(iterable)`.\n- Instead of `tuple(list(iterable))`, use `tuple(iterable)`.\n- Instead of `tuple(tuple(iterable))`, use `tuple(iterable)`.\n- Instead of `set(set(iterable))`, use `set(iterable)`.\n- Instead of `set(list(iterable))`, use `set(iterable)`.\n- Instead of `set(tuple(iterable))`, use `set(iterable)`.\n- Instead of `set(sorted(iterable))`, use `set(iterable)`.\n- Instead of `set(reversed(iterable))`, use `set(iterable)`.\n- Instead of `sorted(list(iterable))`, use `sorted(iterable)`.\n- Instead of `sorted(tuple(iterable))`, use `sorted(iterable)`.\n- Instead of `sorted(sorted(iterable))`, use `sorted(iterable)`.\n- Instead of `sorted(reversed(iterable))`, use `sorted(iterable)`.\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-subscript-reversal",
    "code": "C415",
    "explanation": "## What it does\nChecks for unnecessary subscript reversal of iterable.\n\n## Why is this bad?\nIt's unnecessary to reverse the order of an iterable when passing it\ninto `reversed()`, `set()` or `sorted()` functions as they will change\nthe order of the elements again.\n\n## Example\n```python\nsorted(iterable[::-1])\nset(iterable[::-1])\nreversed(iterable[::-1])\n```\n\nUse instead:\n```python\nsorted(iterable)\nset(iterable)\niterable\n```\n"
  },
  {
    "name": "unnecessary-comprehension",
    "code": "C416",
    "explanation": "## What it does\nChecks for unnecessary dict, list, and set comprehension.\n\n## Why is this bad?\nIt's unnecessary to use a dict/list/set comprehension to build a data structure if the\nelements are unchanged. Wrap the iterable with `dict()`, `list()`, or `set()` instead.\n\n## Example\n```python\n{a: b for a, b in iterable}\n[x for x in iterable]\n{x for x in iterable}\n```\n\nUse instead:\n```python\ndict(iterable)\nlist(iterable)\nset(iterable)\n```\n\n## Known problems\n\nThis rule may produce false positives for dictionary comprehensions that iterate over a mapping.\nThe dict constructor behaves differently depending on if it receives a sequence (e.g., a\nlist) or a mapping (e.g., a dict). When a comprehension iterates over the keys of a mapping,\nreplacing it with a `dict()` constructor call will give a different result.\n\nFor example:\n\n```pycon\n>>> d1 = {(1, 2): 3, (4, 5): 6}\n>>> {x: y for x, y in d1}  # Iterates over the keys of a mapping\n{1: 2, 4: 5}\n>>> dict(d1)               # Ruff's incorrect suggested fix\n(1, 2): 3, (4, 5): 6}\n>>> dict(d1.keys())        # Correct fix\n{1: 2, 4: 5}\n```\n\nWhen the comprehension iterates over a sequence, Ruff's suggested fix is correct. However, Ruff\ncannot consistently infer if the iterable type is a sequence or a mapping and cannot suggest\nthe correct fix for mappings.\n\n## Fix safety\nDue to the known problem with dictionary comprehensions, this fix is marked as unsafe.\n\nAdditionally, this fix may drop comments when rewriting the comprehension.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-map",
    "code": "C417",
    "explanation": "## What it does\nChecks for unnecessary `map()` calls with lambda functions.\n\n## Why is this bad?\nUsing `map(func, iterable)` when `func` is a lambda is slower than\nusing a generator expression or a comprehension, as the latter approach\navoids the function call overhead, in addition to being more readable.\n\nThis rule also applies to `map()` calls within `list()`, `set()`, and\n`dict()` calls. For example:\n\n- Instead of `list(map(lambda num: num * 2, nums))`, use\n  `[num * 2 for num in nums]`.\n- Instead of `set(map(lambda num: num % 2 == 0, nums))`, use\n  `{num % 2 == 0 for num in nums}`.\n- Instead of `dict(map(lambda v: (v, v ** 2), values))`, use\n  `{v: v ** 2 for v in values}`.\n\n## Example\n```python\nmap(lambda x: x + 1, iterable)\n```\n\nUse instead:\n```python\n(x + 1 for x in iterable)\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 1
  },
  {
    "name": "unnecessary-literal-within-dict-call",
    "code": "C418",
    "explanation": "## What it does\nChecks for `dict()` calls that take unnecessary dict literals or dict\ncomprehensions as arguments.\n\n## Why is this bad?\nIt's unnecessary to wrap a dict literal or comprehension within a `dict()`\ncall, since the literal or comprehension syntax already returns a\ndictionary.\n\n## Example\n```python\ndict({})\ndict({\"a\": 1})\n```\n\nUse instead:\n```python\n{}\n{\"a\": 1}\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may occasionally drop comments\nwhen rewriting the call. In most cases, though, comments will be preserved.\n",
    "fix": 2
  },
  {
    "name": "unnecessary-comprehension-in-call",
    "code": "C419",
    "explanation": "## What it does\nChecks for unnecessary list or set comprehensions passed to builtin functions that take an iterable.\n\nSet comprehensions are only a violation in the case where the builtin function does not care about\nduplication of elements in the passed iterable.\n\n## Why is this bad?\nMany builtin functions (this rule currently covers `any` and `all` in stable, along with `min`,\n`max`, and `sum` in [preview]) accept any iterable, including a generator. Constructing a\ntemporary list via list comprehension is unnecessary and wastes memory for large iterables.\n\n`any` and `all` can also short-circuit iteration, saving a lot of time. The unnecessary\ncomprehension forces a full iteration of the input iterable, giving up the benefits of\nshort-circuiting. For example, compare the performance of `all` with a list comprehension\nagainst that of a generator in a case where an early short-circuit is possible (almost 40x\nfaster):\n\n```console\nIn [1]: %timeit all([i for i in range(1000)])\n8.14 \u00b5s \u00b1 25.4 ns per loop (mean \u00b1 std. dev. of 7 runs, 100,000 loops each)\n\nIn [2]: %timeit all(i for i in range(1000))\n212 ns \u00b1 0.892 ns per loop (mean \u00b1 std. dev. of 7 runs, 1,000,000 loops each)\n```\n\nThis performance improvement is due to short-circuiting. If the entire iterable has to be\ntraversed, the comprehension version may even be a bit faster: list allocation overhead is not\nnecessarily greater than generator overhead.\n\nApplying this rule simplifies the code and will usually save memory, but in the absence of\nshort-circuiting it may not improve performance. (It may even slightly regress performance,\nthough the difference will usually be small.)\n\n## Example\n```python\nany([x.id for x in bar])\nall([x.id for x in bar])\nsum([x.val for x in bar])\nmin([x.val for x in bar])\nmax([x.val for x in bar])\n```\n\nUse instead:\n```python\nany(x.id for x in bar)\nall(x.id for x in bar)\nsum(x.val for x in bar)\nmin(x.val for x in bar)\nmax(x.val for x in bar)\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it can change the behavior of the code if the iteration\nhas side effects (due to laziness and short-circuiting). The fix may also drop comments when\nrewriting some comprehensions.\n\n[preview]: https://docs.astral.sh/ruff/preview/\n",
    "fix": 1
  },
  {
    "name": "unnecessary-dict-comprehension-for-iterable",
    "code": "C420",
    "explanation": "## What it does\nChecks for unnecessary dict comprehension when creating a dictionary from\nan iterable.\n\n## Why is this bad?\nIt's unnecessary to use a dict comprehension to build a dictionary from\nan iterable when the value is static.\n\nPrefer `dict.fromkeys(iterable)` over `{value: None for value in iterable}`,\nas `dict.fromkeys` is more readable and efficient.\n\n## Example\n```python\n{a: None for a in iterable}\n{a: 1 for a in iterable}\n```\n\nUse instead:\n```python\ndict.fromkeys(iterable)\ndict.fromkeys(iterable, 1)\n```\n\n## References\n- [Python documentation: `dict.fromkeys`](https://docs.python.org/3/library/stdtypes.html#dict.fromkeys)\n",
    "fix": 1
  },
  {
    "name": "missing-copyright-notice",
    "code": "CPY001",
    "explanation": "## What it does\nChecks for the absence of copyright notices within Python files.\n\nNote that this check only searches within the first 4096 bytes of the file.\n\n## Why is this bad?\nIn some codebases, it's common to have a license header at the top of every\nfile. This rule ensures that the license header is present.\n\n## Options\n- `lint.flake8-copyright.author`\n- `lint.flake8-copyright.min-file-size`\n- `lint.flake8-copyright.notice-rgx`\n",
    "preview": true
  },
  {
    "name": "call-datetime-without-tzinfo",
    "code": "DTZ001",
    "explanation": "## What it does\nChecks for `datetime` instantiations that do not specify a timezone.\n\n## Why is this bad?\n`datetime` objects are \"naive\" by default, in that they do not include\ntimezone information. \"Naive\" objects are easy to understand, but ignore\nsome aspects of reality, which can lead to subtle bugs. Timezone-aware\n`datetime` objects are preferred, as they represent a specific moment in\ntime, unlike \"naive\" objects.\n\nBy providing a non-`None` value for `tzinfo`, a `datetime` can be made\ntimezone-aware.\n\n## Example\n```python\nimport datetime\n\ndatetime.datetime(2000, 1, 1, 0, 0, 0)\n```\n\nUse instead:\n```python\nimport datetime\n\ndatetime.datetime(2000, 1, 1, 0, 0, 0, tzinfo=datetime.timezone.utc)\n```\n\nOr, on Python 3.11 and later:\n```python\nimport datetime\n\ndatetime.datetime(2000, 1, 1, 0, 0, 0, tzinfo=datetime.UTC)\n```\n"
  },
  {
    "name": "call-datetime-today",
    "code": "DTZ002",
    "explanation": "## What it does\nChecks for usage of `datetime.datetime.today()`.\n\n## Why is this bad?\n`datetime` objects are \"naive\" by default, in that they do not include\ntimezone information. \"Naive\" objects are easy to understand, but ignore\nsome aspects of reality, which can lead to subtle bugs. Timezone-aware\n`datetime` objects are preferred, as they represent a specific moment in\ntime, unlike \"naive\" objects.\n\n`datetime.datetime.today()` creates a \"naive\" object; instead, use\n`datetime.datetime.now(tz=...)` to create a timezone-aware object.\n\n## Example\n```python\nimport datetime\n\ndatetime.datetime.today()\n```\n\nUse instead:\n```python\nimport datetime\n\ndatetime.datetime.now(tz=datetime.timezone.utc)\n```\n\nOr, for Python 3.11 and later:\n```python\nimport datetime\n\ndatetime.datetime.now(tz=datetime.UTC)\n```\n"
  },
  {
    "name": "call-datetime-utcnow",
    "code": "DTZ003",
    "explanation": "## What it does\nChecks for usage of `datetime.datetime.utcnow()`.\n\n## Why is this bad?\nPython datetime objects can be naive or timezone-aware. While an aware\nobject represents a specific moment in time, a naive object does not\ncontain enough information to unambiguously locate itself relative to other\ndatetime objects. Since this can lead to errors, it is recommended to\nalways use timezone-aware objects.\n\n`datetime.datetime.utcnow()` returns a naive datetime object; instead, use\n`datetime.datetime.now(tz=...)` to create a timezone-aware object.\n\n## Example\n```python\nimport datetime\n\ndatetime.datetime.utcnow()\n```\n\nUse instead:\n```python\nimport datetime\n\ndatetime.datetime.now(tz=datetime.timezone.utc)\n```\n\nOr, for Python 3.11 and later:\n```python\nimport datetime\n\ndatetime.datetime.now(tz=datetime.UTC)\n```\n\n## References\n- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)\n"
  },
  {
    "name": "call-datetime-utcfromtimestamp",
    "code": "DTZ004",
    "explanation": "## What it does\nChecks for usage of `datetime.datetime.utcfromtimestamp()`.\n\n## Why is this bad?\nPython datetime objects can be naive or timezone-aware. While an aware\nobject represents a specific moment in time, a naive object does not\ncontain enough information to unambiguously locate itself relative to other\ndatetime objects. Since this can lead to errors, it is recommended to\nalways use timezone-aware objects.\n\n`datetime.datetime.utcfromtimestamp()` returns a naive datetime\nobject; instead, use `datetime.datetime.fromtimestamp(ts, tz=...)`\nto create a timezone-aware object.\n\n## Example\n```python\nimport datetime\n\ndatetime.datetime.utcfromtimestamp(946684800)\n```\n\nUse instead:\n```python\nimport datetime\n\ndatetime.datetime.fromtimestamp(946684800, tz=datetime.timezone.utc)\n```\n\nOr, on Python 3.11 and later:\n```python\nimport datetime\n\ndatetime.datetime.fromtimestamp(946684800, tz=datetime.UTC)\n```\n\n## References\n- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)\n"
  },
  {
    "name": "call-datetime-now-without-tzinfo",
    "code": "DTZ005",
    "explanation": "## What it does\nChecks for usages of `datetime.datetime.now()` that do not specify a timezone.\n\n## Why is this bad?\nPython datetime objects can be naive or timezone-aware. While an aware\nobject represents a specific moment in time, a naive object does not\ncontain enough information to unambiguously locate itself relative to other\ndatetime objects. Since this can lead to errors, it is recommended to\nalways use timezone-aware objects.\n\n`datetime.datetime.now()` or `datetime.datetime.now(tz=None)` returns a naive\ndatetime object. Instead, use `datetime.datetime.now(tz=<timezone>)` to create\na timezone-aware object.\n\n## Example\n```python\nimport datetime\n\ndatetime.datetime.now()\n```\n\nUse instead:\n```python\nimport datetime\n\ndatetime.datetime.now(tz=datetime.timezone.utc)\n```\n\nOr, for Python 3.11 and later:\n```python\nimport datetime\n\ndatetime.datetime.now(tz=datetime.UTC)\n```\n\n## References\n- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)\n"
  },
  {
    "name": "call-datetime-fromtimestamp",
    "code": "DTZ006",
    "explanation": "## What it does\nChecks for usage of `datetime.datetime.fromtimestamp()` that do not specify\na timezone.\n\n## Why is this bad?\nPython datetime objects can be naive or timezone-aware. While an aware\nobject represents a specific moment in time, a naive object does not\ncontain enough information to unambiguously locate itself relative to other\ndatetime objects. Since this can lead to errors, it is recommended to\nalways use timezone-aware objects.\n\n`datetime.datetime.fromtimestamp(ts)` or\n`datetime.datetime.fromtimestampe(ts, tz=None)` returns a naive datetime\nobject. Instead, use `datetime.datetime.fromtimestamp(ts, tz=<timezone>)`\nto create a timezone-aware object.\n\n## Example\n```python\nimport datetime\n\ndatetime.datetime.fromtimestamp(946684800)\n```\n\nUse instead:\n```python\nimport datetime\n\ndatetime.datetime.fromtimestamp(946684800, tz=datetime.timezone.utc)\n```\n\nOr, on Python 3.11 and later:\n```python\nimport datetime\n\ndatetime.datetime.fromtimestamp(946684800, tz=datetime.UTC)\n```\n\n## References\n- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)\n"
  },
  {
    "name": "call-datetime-strptime-without-zone",
    "code": "DTZ007",
    "explanation": "## What it does\nChecks for uses of `datetime.datetime.strptime()` that lead to naive\ndatetime objects.\n\n## Why is this bad?\nPython datetime objects can be naive or timezone-aware. While an aware\nobject represents a specific moment in time, a naive object does not\ncontain enough information to unambiguously locate itself relative to other\ndatetime objects. Since this can lead to errors, it is recommended to\nalways use timezone-aware objects.\n\n`datetime.datetime.strptime()` without `%z` returns a naive datetime\nobject. Follow it with `.replace(tzinfo=<timezone>)` or `.astimezone()`.\n\n## Example\n```python\nimport datetime\n\ndatetime.datetime.strptime(\"2022/01/31\", \"%Y/%m/%d\")\n```\n\nInstead, use `.replace(tzinfo=<timezone>)`:\n```python\nimport datetime\n\ndatetime.datetime.strptime(\"2022/01/31\", \"%Y/%m/%d\").replace(\n    tzinfo=datetime.timezone.utc\n)\n```\n\nOr, use `.astimezone()`:\n```python\nimport datetime\n\ndatetime.datetime.strptime(\"2022/01/31\", \"%Y/%m/%d\").astimezone(datetime.timezone.utc)\n```\n\nOn Python 3.11 and later, `datetime.timezone.utc` can be replaced with\n`datetime.UTC`.\n\n## References\n- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)\n- [Python documentation: `strftime()` and `strptime()` Behavior](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-behavior)\n"
  },
  {
    "name": "call-date-today",
    "code": "DTZ011",
    "explanation": "## What it does\nChecks for usage of `datetime.date.today()`.\n\n## Why is this bad?\nPython datetime objects can be naive or timezone-aware. While an aware\nobject represents a specific moment in time, a naive object does not\ncontain enough information to unambiguously locate itself relative to other\ndatetime objects. Since this can lead to errors, it is recommended to\nalways use timezone-aware objects.\n\n`datetime.date.today` returns a naive datetime object. Instead, use\n`datetime.datetime.now(tz=...).date()` to create a timezone-aware object.\n\n## Example\n```python\nimport datetime\n\ndatetime.datetime.today()\n```\n\nUse instead:\n```python\nimport datetime\n\ndatetime.datetime.now(tz=datetime.timezone.utc).date()\n```\n\nOr, for Python 3.11 and later:\n```python\nimport datetime\n\ndatetime.datetime.now(tz=datetime.UTC).date()\n```\n\n## References\n- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)\n"
  },
  {
    "name": "call-date-fromtimestamp",
    "code": "DTZ012",
    "explanation": "## What it does\nChecks for usage of `datetime.date.fromtimestamp()`.\n\n## Why is this bad?\nPython datetime objects can be naive or timezone-aware. While an aware\nobject represents a specific moment in time, a naive object does not\ncontain enough information to unambiguously locate itself relative to other\ndatetime objects. Since this can lead to errors, it is recommended to\nalways use timezone-aware objects.\n\n`datetime.date.fromtimestamp(ts)` returns a naive datetime object.\nInstead, use `datetime.datetime.fromtimestamp(ts, tz=...)` to create a\ntimezone-aware object.\n\n## Example\n```python\nimport datetime\n\ndatetime.date.fromtimestamp(946684800)\n```\n\nUse instead:\n```python\nimport datetime\n\ndatetime.datetime.fromtimestamp(946684800, tz=datetime.timezone.utc)\n```\n\nOr, for Python 3.11 and later:\n```python\nimport datetime\n\ndatetime.datetime.fromtimestamp(946684800, tz=datetime.UTC)\n```\n\n## References\n- [Python documentation: Aware and Naive Objects](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)\n"
  },
  {
    "name": "datetime-min-max",
    "code": "DTZ901",
    "explanation": "## What it does\nChecks for uses of `datetime.datetime.min` and `datetime.datetime.max`.\n\n## Why is this bad?\n`datetime.min` and `datetime.max` are non-timezone-aware datetime objects.\n\nAs such, operations on `datetime.min` and `datetime.max` may behave\nunexpectedly, as in:\n\n```python\n# Timezone: UTC-14\ndatetime.min.timestamp()  # ValueError: year 0 is out of range\ndatetime.max.timestamp()  # ValueError: year 10000 is out of range\n```\n\n## Example\n```python\ndatetime.max\n```\n\nUse instead:\n```python\ndatetime.max.replace(tzinfo=datetime.UTC)\n```\n"
  },
  {
    "name": "debugger",
    "code": "T100",
    "explanation": "## What it does\nChecks for the presence of debugger calls and imports.\n\n## Why is this bad?\nDebugger calls and imports should be used for debugging purposes only. The\npresence of a debugger call or import in production code is likely a\nmistake and may cause unintended behavior, such as exposing sensitive\ninformation or causing the program to hang.\n\nInstead, consider using a logging library to log information about the\nprogram's state, and writing tests to verify that the program behaves\nas expected.\n\n## Example\n```python\ndef foo():\n    breakpoint()\n```\n\n## References\n- [Python documentation: `pdb` \u2014 The Python Debugger](https://docs.python.org/3/library/pdb.html)\n- [Python documentation: `logging` \u2014 Logging facility for Python](https://docs.python.org/3/library/logging.html)\n"
  },
  {
    "name": "django-nullable-model-string-field",
    "code": "DJ001",
    "explanation": "## What it does\nChecks nullable string-based fields (like `CharField` and `TextField`)\nin Django models.\n\n## Why is this bad?\nIf a string-based field is nullable, then your model will have two possible\nrepresentations for \"no data\": `None` and the empty string. This can lead to\nconfusion, as clients of the API have to check for both `None` and the\nempty string when trying to determine if the field has data.\n\nThe Django convention is to use the empty string in lieu of `None` for\nstring-based fields.\n\n## Example\n```python\nfrom django.db import models\n\n\nclass MyModel(models.Model):\n    field = models.CharField(max_length=255, null=True)\n```\n\nUse instead:\n```python\nfrom django.db import models\n\n\nclass MyModel(models.Model):\n    field = models.CharField(max_length=255, default=\"\")\n```\n"
  },
  {
    "name": "django-locals-in-render-function",
    "code": "DJ003",
    "explanation": "## What it does\nChecks for the use of `locals()` in `render` functions.\n\n## Why is this bad?\nUsing `locals()` can expose internal variables or other unintentional\ndata to the rendered template.\n\n## Example\n```python\nfrom django.shortcuts import render\n\n\ndef index(request):\n    posts = Post.objects.all()\n    return render(request, \"app/index.html\", locals())\n```\n\nUse instead:\n```python\nfrom django.shortcuts import render\n\n\ndef index(request):\n    posts = Post.objects.all()\n    context = {\"posts\": posts}\n    return render(request, \"app/index.html\", context)\n```\n"
  },
  {
    "name": "django-exclude-with-model-form",
    "code": "DJ006",
    "explanation": "## What it does\nChecks for the use of `exclude` in Django `ModelForm` classes.\n\n## Why is this bad?\nIf a `ModelForm` includes the `exclude` attribute, any new field that\nis added to the model will automatically be exposed for modification.\n\n## Example\n```python\nfrom django.forms import ModelForm\n\n\nclass PostForm(ModelForm):\n    class Meta:\n        model = Post\n        exclude = [\"author\"]\n```\n\nUse instead:\n```python\nfrom django.forms import ModelForm\n\n\nclass PostForm(ModelForm):\n    class Meta:\n        model = Post\n        fields = [\"title\", \"content\"]\n```\n"
  },
  {
    "name": "django-all-with-model-form",
    "code": "DJ007",
    "explanation": "## What it does\nChecks for the use of `fields = \"__all__\"` in Django `ModelForm`\nclasses.\n\n## Why is this bad?\nIf a `ModelForm` includes the `fields = \"__all__\"` attribute, any new\nfield that is added to the model will automatically be exposed for\nmodification.\n\n## Example\n```python\nfrom django.forms import ModelForm\n\n\nclass PostForm(ModelForm):\n    class Meta:\n        model = Post\n        fields = \"__all__\"\n```\n\nUse instead:\n```python\nfrom django.forms import ModelForm\n\n\nclass PostForm(ModelForm):\n    class Meta:\n        model = Post\n        fields = [\"title\", \"content\"]\n```\n"
  },
  {
    "name": "django-model-without-dunder-str",
    "code": "DJ008",
    "explanation": "## What it does\nChecks that a `__str__` method is defined in Django models.\n\n## Why is this bad?\nDjango models should define a `__str__` method to return a string representation\nof the model instance, as Django calls this method to display the object in\nthe Django Admin and elsewhere.\n\nModels without a `__str__` method will display a non-meaningful representation\nof the object in the Django Admin.\n\n## Example\n```python\nfrom django.db import models\n\n\nclass MyModel(models.Model):\n    field = models.CharField(max_length=255)\n```\n\nUse instead:\n```python\nfrom django.db import models\n\n\nclass MyModel(models.Model):\n    field = models.CharField(max_length=255)\n\n    def __str__(self):\n        return f\"{self.field}\"\n```\n"
  },
  {
    "name": "django-unordered-body-content-in-model",
    "code": "DJ012",
    "explanation": "## What it does\nChecks for the order of Model's inner classes, methods, and fields as per\nthe [Django Style Guide].\n\n## Why is this bad?\nThe [Django Style Guide] specifies that the order of Model inner classes,\nattributes and methods should be as follows:\n\n1. All database fields\n2. Custom manager attributes\n3. `class Meta`\n4. `def __str__()`\n5. `def save()`\n6. `def get_absolute_url()`\n7. Any custom methods\n\n## Example\n```python\nfrom django.db import models\n\n\nclass StrBeforeFieldModel(models.Model):\n    class Meta:\n        verbose_name = \"test\"\n        verbose_name_plural = \"tests\"\n\n    def __str__(self):\n        return \"foobar\"\n\n    first_name = models.CharField(max_length=32)\n    last_name = models.CharField(max_length=40)\n```\n\nUse instead:\n```python\nfrom django.db import models\n\n\nclass StrBeforeFieldModel(models.Model):\n    first_name = models.CharField(max_length=32)\n    last_name = models.CharField(max_length=40)\n\n    class Meta:\n        verbose_name = \"test\"\n        verbose_name_plural = \"tests\"\n\n    def __str__(self):\n        return \"foobar\"\n```\n\n[Django Style Guide]: https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/#model-style\n"
  },
  {
    "name": "django-non-leading-receiver-decorator",
    "code": "DJ013",
    "explanation": "## What it does\nChecks that Django's `@receiver` decorator is listed first, prior to\nany other decorators.\n\n## Why is this bad?\nDjango's `@receiver` decorator is special in that it does not return\na wrapped function. Rather, `@receiver` connects the decorated function\nto a signal. If any other decorators are listed before `@receiver`,\nthe decorated function will not be connected to the signal.\n\n## Example\n```python\nfrom django.dispatch import receiver\nfrom django.db.models.signals import post_save\n\n\n@transaction.atomic\n@receiver(post_save, sender=MyModel)\ndef my_handler(sender, instance, created, **kwargs):\n    pass\n```\n\nUse instead:\n```python\nfrom django.dispatch import receiver\nfrom django.db.models.signals import post_save\n\n\n@receiver(post_save, sender=MyModel)\n@transaction.atomic\ndef my_handler(sender, instance, created, **kwargs):\n    pass\n```\n"
  },
  {
    "name": "raw-string-in-exception",
    "code": "EM101",
    "explanation": "## What it does\nChecks for the use of string literals in exception constructors.\n\n## Why is this bad?\nPython includes the `raise` in the default traceback (and formatters\nlike Rich and IPython do too).\n\nBy using a string literal, the error message will be duplicated in the\ntraceback, which can make the traceback less readable.\n\n## Example\nGiven:\n```python\nraise RuntimeError(\"'Some value' is incorrect\")\n```\n\nPython will produce a traceback like:\n```console\nTraceback (most recent call last):\n  File \"tmp.py\", line 2, in <module>\n    raise RuntimeError(\"'Some value' is incorrect\")\nRuntimeError: 'Some value' is incorrect\n```\n\nInstead, assign the string to a variable:\n```python\nmsg = \"'Some value' is incorrect\"\nraise RuntimeError(msg)\n```\n\nWhich will produce a traceback like:\n```console\nTraceback (most recent call last):\n  File \"tmp.py\", line 3, in <module>\n    raise RuntimeError(msg)\nRuntimeError: 'Some value' is incorrect\n```\n",
    "fix": 1
  },
  {
    "name": "f-string-in-exception",
    "code": "EM102",
    "explanation": "## What it does\nChecks for the use of f-strings in exception constructors.\n\n## Why is this bad?\nPython includes the `raise` in the default traceback (and formatters\nlike Rich and IPython do too).\n\nBy using an f-string, the error message will be duplicated in the\ntraceback, which can make the traceback less readable.\n\n## Example\nGiven:\n```python\nsub = \"Some value\"\nraise RuntimeError(f\"{sub!r} is incorrect\")\n```\n\nPython will produce a traceback like:\n```console\nTraceback (most recent call last):\n  File \"tmp.py\", line 2, in <module>\n    raise RuntimeError(f\"{sub!r} is incorrect\")\nRuntimeError: 'Some value' is incorrect\n```\n\nInstead, assign the string to a variable:\n```python\nsub = \"Some value\"\nmsg = f\"{sub!r} is incorrect\"\nraise RuntimeError(msg)\n```\n\nWhich will produce a traceback like:\n```console\nTraceback (most recent call last):\n  File \"tmp.py\", line 3, in <module>\n    raise RuntimeError(msg)\nRuntimeError: 'Some value' is incorrect\n```\n",
    "fix": 1
  },
  {
    "name": "dot-format-in-exception",
    "code": "EM103",
    "explanation": "## What it does\nChecks for the use of `.format` calls on string literals in exception\nconstructors.\n\n## Why is this bad?\nPython includes the `raise` in the default traceback (and formatters\nlike Rich and IPython do too).\n\nBy using a `.format` call, the error message will be duplicated in the\ntraceback, which can make the traceback less readable.\n\n## Example\nGiven:\n```python\nsub = \"Some value\"\nraise RuntimeError(\"'{}' is incorrect\".format(sub))\n```\n\nPython will produce a traceback like:\n```console\nTraceback (most recent call last):\n  File \"tmp.py\", line 2, in <module>\n    raise RuntimeError(\"'{}' is incorrect\".format(sub))\nRuntimeError: 'Some value' is incorrect\n```\n\nInstead, assign the string to a variable:\n```python\nsub = \"Some value\"\nmsg = \"'{}' is incorrect\".format(sub)\nraise RuntimeError(msg)\n```\n\nWhich will produce a traceback like:\n```console\nTraceback (most recent call last):\n  File \"tmp.py\", line 3, in <module>\n    raise RuntimeError(msg)\nRuntimeError: 'Some value' is incorrect\n```\n",
    "fix": 1
  },
  {
    "name": "shebang-not-executable",
    "code": "EXE001",
    "explanation": "## What it does\nChecks for a shebang directive in a file that is not executable.\n\n## Why is this bad?\nIn Python, a shebang (also known as a hashbang) is the first line of a\nscript, which specifies the interpreter that should be used to run the\nscript.\n\nThe presence of a shebang suggests that a file is intended to be\nexecutable. If a file contains a shebang but is not executable, then the\nshebang is misleading, or the file is missing the executable bit.\n\nIf the file is meant to be executable, add the executable bit to the file\n(e.g., `chmod +x __main__.py` or `git update-index --chmod=+x __main__.py`).\n\nOtherwise, remove the shebang.\n\nA file is considered executable if it has the executable bit set (i.e., its\npermissions mode intersects with `0o111`). As such, _this rule is only\navailable on Unix-like systems_, and is not enforced on Windows or WSL.\n\n## Example\n```python\n#!/usr/bin/env python\n```\n\n## References\n- [Python documentation: Executable Python Scripts](https://docs.python.org/3/tutorial/appendix.html#executable-python-scripts)\n- [Git documentation: `git update-index --chmod`](https://git-scm.com/docs/git-update-index#Documentation/git-update-index.txt---chmod-x)\n"
  },
  {
    "name": "shebang-missing-executable-file",
    "code": "EXE002",
    "explanation": "## What it does\nChecks for executable `.py` files that do not have a shebang.\n\n## Why is this bad?\nIn Python, a shebang (also known as a hashbang) is the first line of a\nscript, which specifies the interpreter that should be used to run the\nscript.\n\nIf a `.py` file is executable, but does not have a shebang, it may be run\nwith the wrong interpreter, or fail to run at all.\n\nIf the file is meant to be executable, add a shebang, as in:\n```python\n#!/usr/bin/env python\n```\n\nOtherwise, remove the executable bit from the file\n(e.g., `chmod -x __main__.py` or `git update-index --chmod=-x __main__.py`).\n\nA file is considered executable if it has the executable bit set (i.e., its\npermissions mode intersects with `0o111`). As such, _this rule is only\navailable on Unix-like systems_, and is not enforced on Windows or WSL.\n\n## References\n- [Python documentation: Executable Python Scripts](https://docs.python.org/3/tutorial/appendix.html#executable-python-scripts)\n- [Git documentation: `git update-index --chmod`](https://git-scm.com/docs/git-update-index#Documentation/git-update-index.txt---chmod-x)\n"
  },
  {
    "name": "shebang-missing-python",
    "code": "EXE003",
    "explanation": "## What it does\nChecks for a shebang directive in `.py` files that does not contain `python`.\n\n## Why is this bad?\nIn Python, a shebang (also known as a hashbang) is the first line of a\nscript, which specifies the interpreter that should be used to run the\nscript.\n\nFor Python scripts, the shebang must contain `python` to indicate that the\nscript should be executed as a Python script. If the shebang does not\ncontain `python`, then the file will be executed with the default\ninterpreter, which is likely a mistake.\n\n## Example\n```python\n#!/usr/bin/env bash\n```\n\nUse instead:\n```python\n#!/usr/bin/env python3\n```\n\n## References\n- [Python documentation: Executable Python Scripts](https://docs.python.org/3/tutorial/appendix.html#executable-python-scripts)\n"
  },
  {
    "name": "shebang-leading-whitespace",
    "code": "EXE004",
    "explanation": "## What it does\nChecks for whitespace before a shebang directive.\n\n## Why is this bad?\nIn Python, a shebang (also known as a hashbang) is the first line of a\nscript, which specifies the interpreter that should be used to run the\nscript.\n\nThe shebang's `#!` prefix must be the first two characters of a file. The\npresence of whitespace before the shebang will cause the shebang to be\nignored, which is likely a mistake.\n\n## Example\n```python\n #!/usr/bin/env python3\n```\n\nUse instead:\n```python\n#!/usr/bin/env python3\n```\n\n## References\n- [Python documentation: Executable Python Scripts](https://docs.python.org/3/tutorial/appendix.html#executable-python-scripts)\n",
    "fix": 2
  },
  {
    "name": "shebang-not-first-line",
    "code": "EXE005",
    "explanation": "## What it does\nChecks for a shebang directive that is not at the beginning of the file.\n\n## Why is this bad?\nIn Python, a shebang (also known as a hashbang) is the first line of a\nscript, which specifies the interpreter that should be used to run the\nscript.\n\nThe shebang's `#!` prefix must be the first two characters of a file. If\nthe shebang is not at the beginning of the file, it will be ignored, which\nis likely a mistake.\n\n## Example\n```python\nfoo = 1\n#!/usr/bin/env python3\n```\n\nUse instead:\n```python\n#!/usr/bin/env python3\nfoo = 1\n```\n\n## References\n- [Python documentation: Executable Python Scripts](https://docs.python.org/3/tutorial/appendix.html#executable-python-scripts)\n"
  },
  {
    "name": "line-contains-fixme",
    "code": "FIX001",
    "explanation": "## What it does\nChecks for \"FIXME\" comments.\n\n## Why is this bad?\n\"FIXME\" comments are used to describe an issue that should be resolved\n(usually, a bug or unexpected behavior).\n\nConsider resolving the issue before deploying the code.\n\nNote that if you use \"FIXME\" comments as a form of documentation, this\nrule may not be appropriate for your project.\n\n## Example\n```python\ndef speed(distance, time):\n    return distance / time  # FIXME: Raises ZeroDivisionError for time = 0.\n```\n"
  },
  {
    "name": "line-contains-todo",
    "code": "FIX002",
    "explanation": "## What it does\nChecks for \"TODO\" comments.\n\n## Why is this bad?\n\"TODO\" comments are used to describe an issue that should be resolved\n(usually, a missing feature, optimization, or refactoring opportunity).\n\nConsider resolving the issue before deploying the code.\n\nNote that if you use \"TODO\" comments as a form of documentation (e.g.,\nto [provide context for future work](https://gist.github.com/dmnd/ed5d8ef8de2e4cfea174bd5dafcda382)),\nthis rule may not be appropriate for your project.\n\n## Example\n```python\ndef greet(name):\n    return f\"Hello, {name}!\"  # TODO: Add support for custom greetings.\n```\n"
  },
  {
    "name": "line-contains-xxx",
    "code": "FIX003",
    "explanation": "## What it does\nChecks for \"XXX\" comments.\n\n## Why is this bad?\n\"XXX\" comments are used to describe an issue that should be resolved.\n\nConsider resolving the issue before deploying the code, or, at minimum,\nusing a more descriptive comment tag (e.g, \"TODO\").\n\n## Example\n```python\ndef speed(distance, time):\n    return distance / time  # XXX: Raises ZeroDivisionError for time = 0.\n```\n"
  },
  {
    "name": "line-contains-hack",
    "code": "FIX004",
    "explanation": "## What it does\nChecks for \"HACK\" comments.\n\n## Why is this bad?\n\"HACK\" comments are used to describe an issue that should be resolved\n(usually, a suboptimal solution or temporary workaround).\n\nConsider resolving the issue before deploying the code.\n\nNote that if you use \"HACK\" comments as a form of documentation, this\nrule may not be appropriate for your project.\n\n## Example\n```python\nimport os\n\n\ndef running_windows():  # HACK: Use platform module instead.\n    try:\n        os.mkdir(\"C:\\\\Windows\\\\System32\\\\\")\n    except FileExistsError:\n        return True\n    else:\n        os.rmdir(\"C:\\\\Windows\\\\System32\\\\\")\n        return False\n```\n"
  },
  {
    "name": "future-rewritable-type-annotation",
    "code": "FA100",
    "explanation": "## What it does\nChecks for missing `from __future__ import annotations` imports upon\ndetecting type annotations that can be written more succinctly under\nPEP 563.\n\n## Why is this bad?\nPEP 585 enabled the use of a number of convenient type annotations, such as\n`list[str]` instead of `List[str]`. However, these annotations are only\navailable on Python 3.9 and higher, _unless_ the `from __future__ import annotations`\nimport is present.\n\nSimilarly, PEP 604 enabled the use of the `|` operator for unions, such as\n`str | None` instead of `Optional[str]`. However, these annotations are only\navailable on Python 3.10 and higher, _unless_ the `from __future__ import annotations`\nimport is present.\n\nBy adding the `__future__` import, the pyupgrade rules can automatically\nmigrate existing code to use the new syntax, even for older Python versions.\nThis rule thus pairs well with pyupgrade and with Ruff's pyupgrade rules.\n\nThis rule respects the [`target-version`] setting. For example, if your\nproject targets Python 3.10 and above, adding `from __future__ import annotations`\ndoes not impact your ability to leverage PEP 604-style unions (e.g., to\nconvert `Optional[str]` to `str | None`). As such, this rule will only\nflag such usages if your project targets Python 3.9 or below.\n\n## Example\n\n```python\nfrom typing import List, Dict, Optional\n\n\ndef func(obj: Dict[str, Optional[int]]) -> None: ...\n```\n\nUse instead:\n\n```python\nfrom __future__ import annotations\n\nfrom typing import List, Dict, Optional\n\n\ndef func(obj: Dict[str, Optional[int]]) -> None: ...\n```\n\nAfter running the additional pyupgrade rules:\n\n```python\nfrom __future__ import annotations\n\n\ndef func(obj: dict[str, int | None]) -> None: ...\n```\n\n## Options\n- `target-version`\n"
  },
  {
    "name": "future-required-type-annotation",
    "code": "FA102",
    "explanation": "## What it does\nChecks for uses of PEP 585- and PEP 604-style type annotations in Python\nmodules that lack the required `from __future__ import annotations` import\nfor compatibility with older Python versions.\n\n## Why is this bad?\nUsing PEP 585 and PEP 604 style annotations without a `from __future__ import\nannotations` import will cause runtime errors on Python versions prior to\n3.9 and 3.10, respectively.\n\nBy adding the `__future__` import, the interpreter will no longer interpret\nannotations at evaluation time, making the code compatible with both past\nand future Python versions.\n\nThis rule respects the [`target-version`] setting. For example, if your\nproject targets Python 3.10 and above, adding `from __future__ import annotations`\ndoes not impact your ability to leverage PEP 604-style unions (e.g., to\nconvert `Optional[str]` to `str | None`). As such, this rule will only\nflag such usages if your project targets Python 3.9 or below.\n\n## Example\n\n```python\ndef func(obj: dict[str, int | None]) -> None: ...\n```\n\nUse instead:\n\n```python\nfrom __future__ import annotations\n\n\ndef func(obj: dict[str, int | None]) -> None: ...\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as adding `from __future__ import annotations`\nmay change the semantics of the program.\n\n## Options\n- `target-version`\n",
    "fix": 2
  },
  {
    "name": "f-string-in-get-text-func-call",
    "code": "INT001",
    "explanation": "## What it does\nChecks for f-strings in `gettext` function calls.\n\n## Why is this bad?\nIn the `gettext` API, the `gettext` function (often aliased to `_`) returns\na translation of its input argument by looking it up in a translation\ncatalog.\n\nCalling `gettext` with an f-string as its argument can cause unexpected\nbehavior. Since the f-string is resolved before the function call, the\ntranslation catalog will look up the formatted string, rather than the\nf-string template.\n\nInstead, format the value returned by the function call, rather than\nits argument.\n\n## Example\n```python\nfrom gettext import gettext as _\n\nname = \"Maria\"\n_(f\"Hello, {name}!\")  # Looks for \"Hello, Maria!\".\n```\n\nUse instead:\n```python\nfrom gettext import gettext as _\n\nname = \"Maria\"\n_(\"Hello, %s!\") % name  # Looks for \"Hello, %s!\".\n```\n\n## References\n- [Python documentation: `gettext` \u2014 Multilingual internationalization services](https://docs.python.org/3/library/gettext.html)\n"
  },
  {
    "name": "format-in-get-text-func-call",
    "code": "INT002",
    "explanation": "## What it does\nChecks for `str.format` calls in `gettext` function calls.\n\n## Why is this bad?\nIn the `gettext` API, the `gettext` function (often aliased to `_`) returns\na translation of its input argument by looking it up in a translation\ncatalog.\n\nCalling `gettext` with a formatted string as its argument can cause\nunexpected behavior. Since the formatted string is resolved before the\nfunction call, the translation catalog will look up the formatted string,\nrather than the `str.format`-style template.\n\nInstead, format the value returned by the function call, rather than\nits argument.\n\n## Example\n```python\nfrom gettext import gettext as _\n\nname = \"Maria\"\n_(\"Hello, %s!\" % name)  # Looks for \"Hello, Maria!\".\n```\n\nUse instead:\n```python\nfrom gettext import gettext as _\n\nname = \"Maria\"\n_(\"Hello, %s!\") % name  # Looks for \"Hello, %s!\".\n```\n\n## References\n- [Python documentation: `gettext` \u2014 Multilingual internationalization services](https://docs.python.org/3/library/gettext.html)\n"
  },
  {
    "name": "printf-in-get-text-func-call",
    "code": "INT003",
    "explanation": "## What it does\nChecks for printf-style formatted strings in `gettext` function calls.\n\n## Why is this bad?\nIn the `gettext` API, the `gettext` function (often aliased to `_`) returns\na translation of its input argument by looking it up in a translation\ncatalog.\n\nCalling `gettext` with a formatted string as its argument can cause\nunexpected behavior. Since the formatted string is resolved before the\nfunction call, the translation catalog will look up the formatted string,\nrather than the printf-style template.\n\nInstead, format the value returned by the function call, rather than\nits argument.\n\n## Example\n```python\nfrom gettext import gettext as _\n\nname = \"Maria\"\n_(\"Hello, {}!\".format(name))  # Looks for \"Hello, Maria!\".\n```\n\nUse instead:\n```python\nfrom gettext import gettext as _\n\nname = \"Maria\"\n_(\"Hello, %s!\") % name  # Looks for \"Hello, %s!\".\n```\n\n## References\n- [Python documentation: `gettext` \u2014 Multilingual internationalization services](https://docs.python.org/3/library/gettext.html)\n"
  },
  {
    "name": "single-line-implicit-string-concatenation",
    "code": "ISC001",
    "explanation": "## What it does\nChecks for implicitly concatenated strings on a single line.\n\n## Why is this bad?\nWhile it is valid Python syntax to concatenate multiple string or byte\nliterals implicitly (via whitespace delimiters), it is unnecessary and\nnegatively affects code readability.\n\nIn some cases, the implicit concatenation may also be unintentional, as\ncode formatters are capable of introducing single-line implicit\nconcatenations when collapsing long lines.\n\n## Example\n```python\nz = \"The quick \" \"brown fox.\"\n```\n\nUse instead:\n```python\nz = \"The quick brown fox.\"\n```\n",
    "fix": 1
  },
  {
    "name": "multi-line-implicit-string-concatenation",
    "code": "ISC002",
    "explanation": "## What it does\nChecks for implicitly concatenated strings that span multiple lines.\n\n## Why is this bad?\nFor string literals that wrap across multiple lines, [PEP 8] recommends\nthe use of implicit string concatenation within parentheses instead of\nusing a backslash for line continuation, as the former is more readable\nthan the latter.\n\nBy default, this rule will only trigger if the string literal is\nconcatenated via a backslash. To disallow implicit string concatenation\naltogether, set the [`lint.flake8-implicit-str-concat.allow-multiline`] option\nto `false`.\n\n## Example\n```python\nz = \"The quick brown fox jumps over the lazy \"\\\n    \"dog.\"\n```\n\nUse instead:\n```python\nz = (\n    \"The quick brown fox jumps over the lazy \"\n    \"dog.\"\n)\n```\n\n## Options\n- `lint.flake8-implicit-str-concat.allow-multiline`\n\n## Formatter compatibility\nUsing this rule with `allow-multiline = false` can be incompatible with the\nformatter because the [formatter] can introduce new multi-line implicitly\nconcatenated strings. We recommend to either:\n\n* Enable `ISC001` to disallow all implicit concatenated strings\n* Setting `allow-multiline = true`\n\n[PEP 8]: https://peps.python.org/pep-0008/#maximum-line-length\n[formatter]:https://docs.astral.sh/ruff/formatter/\n"
  },
  {
    "name": "explicit-string-concatenation",
    "code": "ISC003",
    "explanation": "## What it does\nChecks for string literals that are explicitly concatenated (using the\n`+` operator).\n\n## Why is this bad?\nFor string literals that wrap across multiple lines, implicit string\nconcatenation within parentheses is preferred over explicit\nconcatenation using the `+` operator, as the former is more readable.\n\n## Example\n```python\nz = (\n    \"The quick brown fox jumps over the lazy \"\n    + \"dog\"\n)\n```\n\nUse instead:\n```python\nz = (\n    \"The quick brown fox jumps over the lazy \"\n    \"dog\"\n)\n```\n"
  },
  {
    "name": "unconventional-import-alias",
    "code": "ICN001",
    "explanation": "## What it does\nChecks for imports that are typically imported using a common convention,\nlike `import pandas as pd`, and enforces that convention.\n\n## Why is this bad?\nConsistency is good. Use a common convention for imports to make your code\nmore readable and idiomatic.\n\nFor example, `import pandas as pd` is a common\nconvention for importing the `pandas` library, and users typically expect\nPandas to be aliased as `pd`.\n\n## Example\n```python\nimport pandas\n```\n\nUse instead:\n```python\nimport pandas as pd\n```\n\n## Options\n- `lint.flake8-import-conventions.aliases`\n- `lint.flake8-import-conventions.extend-aliases`\n",
    "fix": 1
  },
  {
    "name": "banned-import-alias",
    "code": "ICN002",
    "explanation": "## What it does\nChecks for imports that use non-standard naming conventions, like\n`import tensorflow.keras.backend as K`.\n\n## Why is this bad?\nConsistency is good. Avoid using a non-standard naming convention for\nimports, and, in particular, choosing import aliases that violate PEP 8.\n\nFor example, aliasing via `import tensorflow.keras.backend as K` violates\nthe guidance of PEP 8, and is thus avoided in some projects.\n\n## Example\n```python\nimport tensorflow.keras.backend as K\n```\n\nUse instead:\n```python\nimport tensorflow as tf\n\ntf.keras.backend\n```\n\n## Options\n- `lint.flake8-import-conventions.banned-aliases`\n"
  },
  {
    "name": "banned-import-from",
    "code": "ICN003",
    "explanation": "## What it does\nChecks for member imports that should instead be accessed by importing the\nmodule.\n\n## Why is this bad?\nConsistency is good. Use a common convention for imports to make your code\nmore readable and idiomatic.\n\nFor example, it's common to import `pandas` as `pd`, and then access\nmembers like `Series` via `pd.Series`, rather than importing `Series`\ndirectly.\n\n## Example\n```python\nfrom pandas import Series\n```\n\nUse instead:\n```python\nimport pandas as pd\n\npd.Series\n```\n\n## Options\n- `lint.flake8-import-conventions.banned-from`\n"
  },
  {
    "name": "direct-logger-instantiation",
    "code": "LOG001",
    "explanation": "## What it does\nChecks for direct instantiation of `logging.Logger`, as opposed to using\n`logging.getLogger()`.\n\n## Why is this bad?\nThe [Logger Objects] documentation states that:\n\n> Note that Loggers should NEVER be instantiated directly, but always\n> through the module-level function `logging.getLogger(name)`.\n\nIf a logger is directly instantiated, it won't be added to the logger\ntree, and will bypass all configuration. Messages logged to it will\nonly be sent to the \"handler of last resort\", skipping any filtering\nor formatting.\n\n## Example\n```python\nimport logging\n\nlogger = logging.Logger(__name__)\n```\n\nUse instead:\n```python\nimport logging\n\nlogger = logging.getLogger(__name__)\n```\n\n[Logger Objects]: https://docs.python.org/3/library/logging.html#logger-objects\n",
    "fix": 1
  },
  {
    "name": "invalid-get-logger-argument",
    "code": "LOG002",
    "explanation": "## What it does\nChecks for any usage of `__cached__` and `__file__` as an argument to\n`logging.getLogger()`.\n\n## Why is this bad?\nThe [logging documentation] recommends this pattern:\n\n```python\nlogging.getLogger(__name__)\n```\n\nHere, `__name__` is the fully qualified module name, such as `foo.bar`,\nwhich is the intended format for logger names.\n\nThis rule detects probably-mistaken usage of similar module-level dunder constants:\n\n* `__cached__` - the pathname of the module's compiled version, such as `foo/__pycache__/bar.cpython-311.pyc`.\n* `__file__` - the pathname of the module, such as `foo/bar.py`.\n\n## Example\n```python\nimport logging\n\nlogger = logging.getLogger(__file__)\n```\n\nUse instead:\n```python\nimport logging\n\nlogger = logging.getLogger(__name__)\n```\n\n[logging documentation]: https://docs.python.org/3/library/logging.html#logger-objects\n",
    "fix": 1
  },
  {
    "name": "log-exception-outside-except-handler",
    "code": "LOG004",
    "explanation": "## What it does\nChecks for `.exception()` logging calls outside of exception handlers.\n\n## Why is this bad?\n[The documentation] states:\n> This function should only be called from an exception handler.\n\nCalling `.exception()` outside of an exception handler\nattaches `None` as exception information, leading to confusing messages:\n\n```pycon\n>>> logging.exception(\"example\")\nERROR:root:example\nNoneType: None\n```\n\n## Example\n\n```python\nimport logging\n\nlogging.exception(\"Foobar\")\n```\n\nUse instead:\n\n```python\nimport logging\n\nlogging.error(\"Foobar\")\n```\n\n## Fix safety\nThe fix, if available, will always be marked as unsafe, as it changes runtime behavior.\n\n[The documentation]: https://docs.python.org/3/library/logging.html#logging.exception\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "exception-without-exc-info",
    "code": "LOG007",
    "explanation": "## What it does\nChecks for uses of `logging.exception()` with `exc_info` set to `False`.\n\n## Why is this bad?\nThe `logging.exception()` method captures the exception automatically, but\naccepts an optional `exc_info` argument to override this behavior. Setting\n`exc_info` to `False` disables the automatic capture of the exception and\nstack trace.\n\nInstead of setting `exc_info` to `False`, prefer `logging.error()`, which\nhas equivalent behavior to `logging.exception()` with `exc_info` set to\n`False`, but is clearer in intent.\n\n## Example\n```python\nlogging.exception(\"...\", exc_info=False)\n```\n\nUse instead:\n```python\nlogging.error(\"...\")\n```\n"
  },
  {
    "name": "undocumented-warn",
    "code": "LOG009",
    "explanation": "## What it does\nChecks for uses of `logging.WARN`.\n\n## Why is this bad?\nThe `logging.WARN` constant is an undocumented alias for `logging.WARNING`.\n\nAlthough it\u2019s not explicitly deprecated, `logging.WARN` is not mentioned\nin the `logging` documentation. Prefer `logging.WARNING` instead.\n\n## Example\n```python\nimport logging\n\n\nlogging.basicConfig(level=logging.WARN)\n```\n\nUse instead:\n```python\nimport logging\n\n\nlogging.basicConfig(level=logging.WARNING)\n```\n",
    "fix": 1
  },
  {
    "name": "exc-info-outside-except-handler",
    "code": "LOG014",
    "explanation": "## What it does\nChecks for logging calls with `exc_info=` outside exception handlers.\n\n## Why is this bad?\nUsing `exc_info=True` outside of an exception handler\nattaches `None` as the exception information, leading to confusing messages:\n\n```pycon\n>>> logging.warning(\"Uh oh\", exc_info=True)\nWARNING:root:Uh oh\nNoneType: None\n```\n\n## Example\n\n```python\nimport logging\n\n\nlogging.warning(\"Foobar\", exc_info=True)\n```\n\nUse instead:\n\n```python\nimport logging\n\n\nlogging.warning(\"Foobar\")\n```\n\n## Fix safety\nThe fix is always marked as unsafe, as it changes runtime behavior.\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "root-logger-call",
    "code": "LOG015",
    "explanation": "## What it does\nChecks for usages of the following `logging` top-level functions:\n`debug`, `info`, `warn`, `warning`, `error`, `critical`, `log`, `exception`.\n\n## Why is this bad?\nUsing the root logger causes the messages to have no source information,\nmaking them less useful for debugging.\n\n## Example\n```python\nimport logging\n\nlogging.info(\"Foobar\")\n```\n\nUse instead:\n```python\nimport logging\n\nlogger = logging.getLogger(__name__)\nlogger.info(\"Foobar\")\n```\n"
  },
  {
    "name": "logging-string-format",
    "code": "G001",
    "explanation": "## What it does\nChecks for uses of `str.format` to format logging messages.\n\n## Why is this bad?\nThe `logging` module provides a mechanism for passing additional values to\nbe logged using the `extra` keyword argument. This is more consistent, more\nefficient, and less error-prone than formatting the string directly.\n\nUsing `str.format` to format a logging message requires that Python eagerly\nformat the string, even if the logging statement is never executed (e.g.,\nif the log level is above the level of the logging statement), whereas\nusing the `extra` keyword argument defers formatting until required.\n\nAdditionally, the use of `extra` will ensure that the values are made\navailable to all handlers, which can then be configured to log the values\nin a consistent manner.\n\nAs an alternative to `extra`, passing values as arguments to the logging\nmethod can also be used to defer string formatting until required.\n\n## Known problems\n\nThis rule detects uses of the `logging` module via a heuristic.\nSpecifically, it matches against:\n\n- Uses of the `logging` module itself (e.g., `import logging; logging.info(...)`).\n- Uses of `flask.current_app.logger` (e.g., `from flask import current_app; current_app.logger.info(...)`).\n- Objects whose name starts with `log` or ends with `logger` or `logging`,\n  when used in the same file in which they are defined (e.g., `logger = logging.getLogger(); logger.info(...)`).\n- Imported objects marked as loggers via the [`lint.logger-objects`] setting, which can be\n  used to enforce these rules against shared logger objects (e.g., `from module import logger; logger.info(...)`,\n  when [`lint.logger-objects`] is set to `[\"module.logger\"]`).\n\n## Example\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(\"{} - Something happened\".format(user))\n```\n\nUse instead:\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(user_id)s - %(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(\"Something happened\", extra={\"user_id\": user})\n```\n\nOr:\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(\"%s - Something happened\", user)\n```\n\n## Options\n- `lint.logger-objects`\n\n## References\n- [Python documentation: `logging`](https://docs.python.org/3/library/logging.html)\n- [Python documentation: Optimization](https://docs.python.org/3/howto/logging.html#optimization)\n"
  },
  {
    "name": "logging-percent-format",
    "code": "G002",
    "explanation": "## What it does\nChecks for uses of `printf`-style format strings to format logging\nmessages.\n\n## Why is this bad?\nThe `logging` module provides a mechanism for passing additional values to\nbe logged using the `extra` keyword argument. This is more consistent, more\nefficient, and less error-prone than formatting the string directly.\n\nUsing `printf`-style format strings to format a logging message requires\nthat Python eagerly format the string, even if the logging statement is\nnever executed (e.g., if the log level is above the level of the logging\nstatement), whereas using the `extra` keyword argument defers formatting\nuntil required.\n\nAdditionally, the use of `extra` will ensure that the values are made\navailable to all handlers, which can then be configured to log the values\nin a consistent manner.\n\nAs an alternative to `extra`, passing values as arguments to the logging\nmethod can also be used to defer string formatting until required.\n\n## Known problems\n\nThis rule detects uses of the `logging` module via a heuristic.\nSpecifically, it matches against:\n\n- Uses of the `logging` module itself (e.g., `import logging; logging.info(...)`).\n- Uses of `flask.current_app.logger` (e.g., `from flask import current_app; current_app.logger.info(...)`).\n- Objects whose name starts with `log` or ends with `logger` or `logging`,\n  when used in the same file in which they are defined (e.g., `logger = logging.getLogger(); logger.info(...)`).\n- Imported objects marked as loggers via the [`lint.logger-objects`] setting, which can be\n  used to enforce these rules against shared logger objects (e.g., `from module import logger; logger.info(...)`,\n  when [`lint.logger-objects`] is set to `[\"module.logger\"]`).\n\n## Example\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(\"%s - Something happened\" % user)\n```\n\nUse instead:\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(user_id)s - %(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(\"Something happened\", extra=dict(user_id=user))\n```\n\nOr:\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(\"%s - Something happened\", user)\n```\n\n## Options\n- `lint.logger-objects`\n\n## References\n- [Python documentation: `logging`](https://docs.python.org/3/library/logging.html)\n- [Python documentation: Optimization](https://docs.python.org/3/howto/logging.html#optimization)\n"
  },
  {
    "name": "logging-string-concat",
    "code": "G003",
    "explanation": "## What it does\nChecks for uses string concatenation via the `+` operator to format logging\nmessages.\n\n## Why is this bad?\nThe `logging` module provides a mechanism for passing additional values to\nbe logged using the `extra` keyword argument. This is more consistent, more\nefficient, and less error-prone than formatting the string directly.\n\nUsing concatenation to format a logging message requires that Python\neagerly format the string, even if the logging statement is never executed\n(e.g., if the log level is above the level of the logging statement),\nwhereas using the `extra` keyword argument defers formatting until required.\n\nAdditionally, the use of `extra` will ensure that the values are made\navailable to all handlers, which can then be configured to log the values\nin a consistent manner.\n\nAs an alternative to `extra`, passing values as arguments to the logging\nmethod can also be used to defer string formatting until required.\n\n## Known problems\n\nThis rule detects uses of the `logging` module via a heuristic.\nSpecifically, it matches against:\n\n- Uses of the `logging` module itself (e.g., `import logging; logging.info(...)`).\n- Uses of `flask.current_app.logger` (e.g., `from flask import current_app; current_app.logger.info(...)`).\n- Objects whose name starts with `log` or ends with `logger` or `logging`,\n  when used in the same file in which they are defined (e.g., `logger = logging.getLogger(); logger.info(...)`).\n- Imported objects marked as loggers via the [`lint.logger-objects`] setting, which can be\n  used to enforce these rules against shared logger objects (e.g., `from module import logger; logger.info(...)`,\n  when [`lint.logger-objects`] is set to `[\"module.logger\"]`).\n\n## Example\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(user + \" - Something happened\")\n```\n\nUse instead:\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(user_id)s - %(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(\"Something happened\", extra=dict(user_id=user))\n```\n\nOr:\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(\"%s - Something happened\", user)\n```\n\n## Options\n- `lint.logger-objects`\n\n## References\n- [Python documentation: `logging`](https://docs.python.org/3/library/logging.html)\n- [Python documentation: Optimization](https://docs.python.org/3/howto/logging.html#optimization)\n"
  },
  {
    "name": "logging-f-string",
    "code": "G004",
    "explanation": "## What it does\nChecks for uses of f-strings to format logging messages.\n\n## Why is this bad?\nThe `logging` module provides a mechanism for passing additional values to\nbe logged using the `extra` keyword argument. This is more consistent, more\nefficient, and less error-prone than formatting the string directly.\n\nUsing f-strings to format a logging message requires that Python eagerly\nformat the string, even if the logging statement is never executed (e.g.,\nif the log level is above the level of the logging statement), whereas\nusing the `extra` keyword argument defers formatting until required.\n\nAdditionally, the use of `extra` will ensure that the values are made\navailable to all handlers, which can then be configured to log the values\nin a consistent manner.\n\nAs an alternative to `extra`, passing values as arguments to the logging\nmethod can also be used to defer string formatting until required.\n\n## Known problems\n\nThis rule detects uses of the `logging` module via a heuristic.\nSpecifically, it matches against:\n\n- Uses of the `logging` module itself (e.g., `import logging; logging.info(...)`).\n- Uses of `flask.current_app.logger` (e.g., `from flask import current_app; current_app.logger.info(...)`).\n- Objects whose name starts with `log` or ends with `logger` or `logging`,\n  when used in the same file in which they are defined (e.g., `logger = logging.getLogger(); logger.info(...)`).\n- Imported objects marked as loggers via the [`lint.logger-objects`] setting, which can be\n  used to enforce these rules against shared logger objects (e.g., `from module import logger; logger.info(...)`,\n  when [`lint.logger-objects`] is set to `[\"module.logger\"]`).\n\n## Example\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(f\"{user} - Something happened\")\n```\n\nUse instead:\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(user_id)s - %(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(\"Something happened\", extra=dict(user_id=user))\n```\n\nOr:\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(message)s\", level=logging.INFO)\n\nuser = \"Maria\"\n\nlogging.info(\"%s - Something happened\", user)\n```\n\n## Options\n- `lint.logger-objects`\n\n## References\n- [Python documentation: `logging`](https://docs.python.org/3/library/logging.html)\n- [Python documentation: Optimization](https://docs.python.org/3/howto/logging.html#optimization)\n"
  },
  {
    "name": "logging-warn",
    "code": "G010",
    "explanation": "## What it does\nChecks for uses of `logging.warn` and `logging.Logger.warn`.\n\n## Why is this bad?\n`logging.warn` and `logging.Logger.warn` are deprecated in favor of\n`logging.warning` and `logging.Logger.warning`, which are functionally\nequivalent.\n\n## Known problems\n\nThis rule detects uses of the `logging` module via a heuristic.\nSpecifically, it matches against:\n\n- Uses of the `logging` module itself (e.g., `import logging; logging.info(...)`).\n- Uses of `flask.current_app.logger` (e.g., `from flask import current_app; current_app.logger.info(...)`).\n- Objects whose name starts with `log` or ends with `logger` or `logging`,\n  when used in the same file in which they are defined (e.g., `logger = logging.getLogger(); logger.info(...)`).\n- Imported objects marked as loggers via the [`lint.logger-objects`] setting, which can be\n  used to enforce these rules against shared logger objects (e.g., `from module import logger; logger.info(...)`,\n  when [`lint.logger-objects`] is set to `[\"module.logger\"]`).\n\n## Example\n```python\nimport logging\n\nlogging.warn(\"Something happened\")\n```\n\nUse instead:\n```python\nimport logging\n\nlogging.warning(\"Something happened\")\n```\n\n## Options\n- `lint.logger-objects`\n\n## References\n- [Python documentation: `logging.warning`](https://docs.python.org/3/library/logging.html#logging.warning)\n- [Python documentation: `logging.Logger.warning`](https://docs.python.org/3/library/logging.html#logging.Logger.warning)\n",
    "fix": 2
  },
  {
    "name": "logging-extra-attr-clash",
    "code": "G101",
    "explanation": "## What it does\nChecks for `extra` keywords in logging statements that clash with\n`LogRecord` attributes.\n\n## Why is this bad?\nThe `logging` module provides a mechanism for passing additional values to\nbe logged using the `extra` keyword argument. These values are then passed\nto the `LogRecord` constructor.\n\nProviding a value via `extra` that clashes with one of the attributes of\nthe `LogRecord` constructor will raise a `KeyError` when the `LogRecord` is\nconstructed.\n\n## Known problems\n\nThis rule detects uses of the `logging` module via a heuristic.\nSpecifically, it matches against:\n\n- Uses of the `logging` module itself (e.g., `import logging; logging.info(...)`).\n- Uses of `flask.current_app.logger` (e.g., `from flask import current_app; current_app.logger.info(...)`).\n- Objects whose name starts with `log` or ends with `logger` or `logging`,\n  when used in the same file in which they are defined (e.g., `logger = logging.getLogger(); logger.info(...)`).\n- Imported objects marked as loggers via the [`lint.logger-objects`] setting, which can be\n  used to enforce these rules against shared logger objects (e.g., `from module import logger; logger.info(...)`,\n  when [`lint.logger-objects`] is set to `[\"module.logger\"]`).\n\n## Example\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(name) - %(message)s\", level=logging.INFO)\n\nusername = \"Maria\"\n\nlogging.info(\"Something happened\", extra=dict(name=username))\n```\n\nUse instead:\n```python\nimport logging\n\nlogging.basicConfig(format=\"%(user_id)s - %(message)s\", level=logging.INFO)\n\nusername = \"Maria\"\n\nlogging.info(\"Something happened\", extra=dict(user_id=username))\n```\n\n## Options\n- `lint.logger-objects`\n\n## References\n- [Python documentation: LogRecord attributes](https://docs.python.org/3/library/logging.html#logrecord-attributes)\n"
  },
  {
    "name": "logging-exc-info",
    "code": "G201",
    "explanation": "## What it does\nChecks for uses of `logging.error` that pass `exc_info=True`.\n\n## Why is this bad?\nCalling `logging.error` with `exc_info=True` is equivalent to calling\n`logging.exception`. Using `logging.exception` is more concise, more\nreadable, and conveys the intent of the logging statement more clearly.\n\n## Known problems\n\nThis rule detects uses of the `logging` module via a heuristic.\nSpecifically, it matches against:\n\n- Uses of the `logging` module itself (e.g., `import logging; logging.info(...)`).\n- Uses of `flask.current_app.logger` (e.g., `from flask import current_app; current_app.logger.info(...)`).\n- Objects whose name starts with `log` or ends with `logger` or `logging`,\n  when used in the same file in which they are defined (e.g., `logger = logging.getLogger(); logger.info(...)`).\n- Imported objects marked as loggers via the [`lint.logger-objects`] setting, which can be\n  used to enforce these rules against shared logger objects (e.g., `from module import logger; logger.info(...)`,\n  when [`lint.logger-objects`] is set to `[\"module.logger\"]`).\n\n## Example\n```python\nimport logging\n\ntry:\n    ...\nexcept ValueError:\n    logging.error(\"Exception occurred\", exc_info=True)\n```\n\nUse instead:\n```python\nimport logging\n\ntry:\n    ...\nexcept ValueError:\n    logging.exception(\"Exception occurred\")\n```\n\n## Options\n- `lint.logger-objects`\n\n## References\n- [Python documentation: `logging.exception`](https://docs.python.org/3/library/logging.html#logging.exception)\n- [Python documentation: `exception`](https://docs.python.org/3/library/logging.html#logging.Logger.exception)\n- [Python documentation: `logging.error`](https://docs.python.org/3/library/logging.html#logging.error)\n- [Python documentation: `error`](https://docs.python.org/3/library/logging.html#logging.Logger.error)\n"
  },
  {
    "name": "logging-redundant-exc-info",
    "code": "G202",
    "explanation": "## What it does\nChecks for redundant `exc_info` keyword arguments in logging statements.\n\n## Why is this bad?\n`exc_info` is `True` by default for `logging.exception`, and `False` by\ndefault for `logging.error`.\n\nPassing `exc_info=True` to `logging.exception` calls is redundant, as is\npassing `exc_info=False` to `logging.error` calls.\n\n## Known problems\n\nThis rule detects uses of the `logging` module via a heuristic.\nSpecifically, it matches against:\n\n- Uses of the `logging` module itself (e.g., `import logging; logging.info(...)`).\n- Uses of `flask.current_app.logger` (e.g., `from flask import current_app; current_app.logger.info(...)`).\n- Objects whose name starts with `log` or ends with `logger` or `logging`,\n  when used in the same file in which they are defined (e.g., `logger = logging.getLogger(); logger.info(...)`).\n- Imported objects marked as loggers via the [`lint.logger-objects`] setting, which can be\n  used to enforce these rules against shared logger objects (e.g., `from module import logger; logger.info(...)`,\n  when [`lint.logger-objects`] is set to `[\"module.logger\"]`).\n\n## Example\n```python\nimport logging\n\ntry:\n    ...\nexcept ValueError:\n    logging.exception(\"Exception occurred\", exc_info=True)\n```\n\nUse instead:\n```python\nimport logging\n\ntry:\n    ...\nexcept ValueError:\n    logging.exception(\"Exception occurred\")\n```\n\n## Options\n- `lint.logger-objects`\n\n## References\n- [Python documentation: `logging.exception`](https://docs.python.org/3/library/logging.html#logging.exception)\n- [Python documentation: `exception`](https://docs.python.org/3/library/logging.html#logging.Logger.exception)\n- [Python documentation: `logging.error`](https://docs.python.org/3/library/logging.html#logging.error)\n- [Python documentation: `error`](https://docs.python.org/3/library/logging.html#logging.Logger.error)\n"
  },
  {
    "name": "implicit-namespace-package",
    "code": "INP001",
    "explanation": "## What it does\nChecks for packages that are missing an `__init__.py` file.\n\n## Why is this bad?\nPython packages are directories that contain a file named `__init__.py`.\nThe existence of this file indicates that the directory is a Python\npackage, and so it can be imported the same way a module can be\nimported.\n\nDirectories that lack an `__init__.py` file can still be imported, but\nthey're indicative of a special kind of package, known as a \"namespace\npackage\" (see: [PEP 420](https://peps.python.org/pep-0420/)).\nNamespace packages are less widely used, so a package that lacks an\n`__init__.py` file is typically meant to be a regular package, and\nthe absence of the `__init__.py` file is probably an oversight.\n\n## Options\n- `namespace-packages`\n"
  },
  {
    "name": "unnecessary-placeholder",
    "code": "PIE790",
    "explanation": "## What it does\nChecks for unnecessary `pass` statements and ellipsis (`...`) literals in\nfunctions, classes, and other blocks.\n\n## Why is this bad?\nIn Python, the `pass` statement and ellipsis (`...`) literal serve as\nplaceholders, allowing for syntactically correct empty code blocks. The\nprimary purpose of these nodes is to avoid syntax errors in situations\nwhere a statement or expression is syntactically required, but no code\nneeds to be executed.\n\nIf a `pass` or ellipsis is present in a code block that includes at least\none other statement (even, e.g., a docstring), it is unnecessary and should\nbe removed.\n\n## Example\n```python\ndef func():\n    \"\"\"Placeholder docstring.\"\"\"\n    pass\n```\n\nUse instead:\n```python\ndef func():\n    \"\"\"Placeholder docstring.\"\"\"\n```\n\nOr, given:\n```python\ndef func():\n    \"\"\"Placeholder docstring.\"\"\"\n    ...\n```\n\nUse instead:\n```python\ndef func():\n    \"\"\"Placeholder docstring.\"\"\"\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe in the rare case that the `pass` or ellipsis\nis followed by a string literal, since removal of the placeholder would convert the\nsubsequent string literal into a docstring.\n\n## References\n- [Python documentation: The `pass` statement](https://docs.python.org/3/reference/simple_stmts.html#the-pass-statement)\n",
    "fix": 2
  },
  {
    "name": "duplicate-class-field-definition",
    "code": "PIE794",
    "explanation": "## What it does\nChecks for duplicate field definitions in classes.\n\n## Why is this bad?\nDefining a field multiple times in a class body is redundant and likely a\nmistake.\n\n## Example\n```python\nclass Person:\n    name = Tom\n    ...\n    name = Ben\n```\n\nUse instead:\n```python\nclass Person:\n    name = Tom\n    ...\n```\n",
    "fix": 2
  },
  {
    "name": "non-unique-enums",
    "code": "PIE796",
    "explanation": "## What it does\nChecks for enums that contain duplicate values.\n\n## Why is this bad?\nEnum values should be unique. Non-unique values are redundant and likely a\nmistake.\n\n## Example\n```python\nfrom enum import Enum\n\n\nclass Foo(Enum):\n    A = 1\n    B = 2\n    C = 1\n```\n\nUse instead:\n```python\nfrom enum import Enum\n\n\nclass Foo(Enum):\n    A = 1\n    B = 2\n    C = 3\n```\n\n## References\n- [Python documentation: `enum.Enum`](https://docs.python.org/3/library/enum.html#enum.Enum)\n"
  },
  {
    "name": "unnecessary-spread",
    "code": "PIE800",
    "explanation": "## What it does\nChecks for unnecessary dictionary unpacking operators (`**`).\n\n## Why is this bad?\nUnpacking a dictionary into another dictionary is redundant. The unpacking\noperator can be removed, making the code more readable.\n\n## Example\n```python\nfoo = {\"A\": 1, \"B\": 2}\nbar = {**foo, **{\"C\": 3}}\n```\n\nUse instead:\n```python\nfoo = {\"A\": 1, \"B\": 2}\nbar = {**foo, \"C\": 3}\n```\n\n## References\n- [Python documentation: Dictionary displays](https://docs.python.org/3/reference/expressions.html#dictionary-displays)\n",
    "fix": 1
  },
  {
    "name": "unnecessary-dict-kwargs",
    "code": "PIE804",
    "explanation": "## What it does\nChecks for unnecessary `dict` kwargs.\n\n## Why is this bad?\nIf the `dict` keys are valid identifiers, they can be passed as keyword\narguments directly.\n\n## Example\n```python\ndef foo(bar):\n    return bar + 1\n\n\nprint(foo(**{\"bar\": 2}))  # prints 3\n```\n\nUse instead:\n```python\ndef foo(bar):\n    return bar + 1\n\n\nprint(foo(bar=2))  # prints 3\n```\n\n## References\n- [Python documentation: Dictionary displays](https://docs.python.org/3/reference/expressions.html#dictionary-displays)\n- [Python documentation: Calls](https://docs.python.org/3/reference/expressions.html#calls)\n",
    "fix": 1
  },
  {
    "name": "reimplemented-container-builtin",
    "code": "PIE807",
    "explanation": "## What it does\nChecks for lambdas that can be replaced with the `list` or `dict` builtins.\n\n## Why is this bad?\nUsing container builtins are more succinct and idiomatic than wrapping\nthe literal in a lambda.\n\n## Example\n```python\nfrom dataclasses import dataclass, field\n\n\n@dataclass\nclass Foo:\n    bar: list[int] = field(default_factory=lambda: [])\n```\n\nUse instead:\n```python\nfrom dataclasses import dataclass, field\n\n\n@dataclass\nclass Foo:\n    bar: list[int] = field(default_factory=list)\n    baz: dict[str, int] = field(default_factory=dict)\n```\n\n## References\n- [Python documentation: `list`](https://docs.python.org/3/library/functions.html#func-list)\n",
    "fix": 1
  },
  {
    "name": "unnecessary-range-start",
    "code": "PIE808",
    "explanation": "## What it does\nChecks for `range` calls with an unnecessary `start` argument.\n\n## Why is this bad?\n`range(0, x)` is equivalent to `range(x)`, as `0` is the default value for\nthe `start` argument. Omitting the `start` argument makes the code more\nconcise and idiomatic.\n\n## Example\n```python\nrange(0, 3)\n```\n\nUse instead:\n```python\nrange(3)\n```\n\n## References\n- [Python documentation: `range`](https://docs.python.org/3/library/stdtypes.html#range)\n",
    "fix": 2
  },
  {
    "name": "multiple-starts-ends-with",
    "code": "PIE810",
    "explanation": "## What it does\nChecks for `startswith` or `endswith` calls on the same value with\ndifferent prefixes or suffixes.\n\n## Why is this bad?\nThe `startswith` and `endswith` methods accept tuples of prefixes or\nsuffixes respectively. Passing a tuple of prefixes or suffixes is more\nefficient and readable than calling the method multiple times.\n\n## Example\n```python\nmsg = \"Hello, world!\"\nif msg.startswith(\"Hello\") or msg.startswith(\"Hi\"):\n    print(\"Greetings!\")\n```\n\nUse instead:\n```python\nmsg = \"Hello, world!\"\nif msg.startswith((\"Hello\", \"Hi\")):\n    print(\"Greetings!\")\n```\n\n## Fix safety\nThis rule's fix is unsafe, as in some cases, it will be unable to determine\nwhether the argument to an existing `.startswith` or `.endswith` call is a\ntuple. For example, given `msg.startswith(x) or msg.startswith(y)`, if `x`\nor `y` is a tuple, and the semantic model is unable to detect it as such,\nthe rule will suggest `msg.startswith((x, y))`, which will error at\nruntime.\n\n## References\n- [Python documentation: `str.startswith`](https://docs.python.org/3/library/stdtypes.html#str.startswith)\n- [Python documentation: `str.endswith`](https://docs.python.org/3/library/stdtypes.html#str.endswith)\n",
    "fix": 2
  },
  {
    "name": "print",
    "code": "T201",
    "explanation": "## What it does\nChecks for `print` statements.\n\n## Why is this bad?\n`print` statements are useful in some situations (e.g., debugging), but\nshould typically be omitted from production code. `print` statements can\nlead to the accidental inclusion of sensitive information in logs, and are\nnot configurable by clients, unlike `logging` statements.\n\n## Example\n```python\ndef add_numbers(a, b):\n    print(f\"The sum of {a} and {b} is {a + b}\")\n    return a + b\n```\n\nUse instead:\n```python\ndef add_numbers(a, b):\n    return a + b\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may remove `print` statements\nthat are used beyond debugging purposes.\n",
    "fix": 1
  },
  {
    "name": "p-print",
    "code": "T203",
    "explanation": "## What it does\nChecks for `pprint` statements.\n\n## Why is this bad?\nLike `print` statements, `pprint` statements are useful in some situations\n(e.g., debugging), but should typically be omitted from production code.\n`pprint` statements can lead to the accidental inclusion of sensitive\ninformation in logs, and are not configurable by clients, unlike `logging`\nstatements.\n\n## Example\n```python\nimport pprint\n\n\ndef merge_dicts(dict_a, dict_b):\n    dict_c = {**dict_a, **dict_b}\n    pprint.pprint(dict_c)\n    return dict_c\n```\n\nUse instead:\n```python\ndef merge_dicts(dict_a, dict_b):\n    dict_c = {**dict_a, **dict_b}\n    return dict_c\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may remove `pprint` statements\nthat are used beyond debugging purposes.\n",
    "fix": 1
  },
  {
    "name": "unprefixed-type-param",
    "code": "PYI001",
    "explanation": "## What it does\nChecks that type `TypeVar`s, `ParamSpec`s, and `TypeVarTuple`s in stubs\nhave names prefixed with `_`.\n\n## Why is this bad?\nPrefixing type parameters with `_` avoids accidentally exposing names\ninternal to the stub.\n\n## Example\n```pyi\nfrom typing import TypeVar\n\nT = TypeVar(\"T\")\n```\n\nUse instead:\n```pyi\nfrom typing import TypeVar\n\n_T = TypeVar(\"_T\")\n```\n"
  },
  {
    "name": "complex-if-statement-in-stub",
    "code": "PYI002",
    "explanation": "## What it does\nChecks for `if` statements with complex conditionals in stubs.\n\n## Why is this bad?\nType checkers understand simple conditionals to express variations between\ndifferent Python versions and platforms. However, complex tests may not be\nunderstood by a type checker, leading to incorrect inferences when they\nanalyze your code.\n\n## Example\n```pyi\nimport sys\n\nif (3, 10) <= sys.version_info < (3, 12): ...\n```\n\nUse instead:\n```pyi\nimport sys\n\nif sys.version_info >= (3, 10) and sys.version_info < (3, 12): ...\n```\n\n## References\n- [Typing documentation: Version and platform checking](https://typing.readthedocs.io/en/latest/spec/directives.html#version-and-platform-checks)\n"
  },
  {
    "name": "unrecognized-version-info-check",
    "code": "PYI003",
    "explanation": "## What it does\nChecks for problematic `sys.version_info`-related conditions in stubs.\n\n## Why is this bad?\nStub files support simple conditionals to test for differences in Python\nversions using `sys.version_info`. However, there are a number of common\nmistakes involving `sys.version_info` comparisons that should be avoided.\nFor example, comparing against a string can lead to unexpected behavior.\n\n## Example\n```pyi\nimport sys\n\nif sys.version_info[0] == \"2\": ...\n```\n\nUse instead:\n```pyi\nimport sys\n\nif sys.version_info[0] == 2: ...\n```\n\n## References\n- [Typing documentation: Version and Platform checking](https://typing.readthedocs.io/en/latest/spec/directives.html#version-and-platform-checks)\n"
  },
  {
    "name": "patch-version-comparison",
    "code": "PYI004",
    "explanation": "## What it does\nChecks for Python version comparisons in stubs that compare against patch\nversions (e.g., Python 3.8.3) instead of major and minor versions (e.g.,\nPython 3.8).\n\n## Why is this bad?\nStub files support simple conditionals to test for differences in Python\nversions and platforms. However, type checkers only understand a limited\nsubset of these conditionals. In particular, type checkers don't support\npatch versions (e.g., Python 3.8.3), only major and minor versions (e.g.,\nPython 3.8). Therefore, version checks in stubs should only use the major\nand minor versions.\n\n## Example\n```pyi\nimport sys\n\nif sys.version_info >= (3, 4, 3): ...\n```\n\nUse instead:\n```pyi\nimport sys\n\nif sys.version_info >= (3, 4): ...\n```\n\n## References\n- [Typing documentation: Version and Platform checking](https://typing.readthedocs.io/en/latest/spec/directives.html#version-and-platform-checks)\n"
  },
  {
    "name": "wrong-tuple-length-version-comparison",
    "code": "PYI005",
    "explanation": "## What it does\nChecks for Python version comparisons that compare against a tuple of the\nwrong length.\n\n## Why is this bad?\nStub files support simple conditionals to test for differences in Python\nversions and platforms. When comparing against `sys.version_info`, avoid\ncomparing against tuples of the wrong length, which can lead to unexpected\nbehavior.\n\n## Example\n```pyi\nimport sys\n\nif sys.version_info[:2] == (3,): ...\n```\n\nUse instead:\n```pyi\nimport sys\n\nif sys.version_info[0] == 3: ...\n```\n\n## References\n- [Typing documentation: Version and Platform checking](https://typing.readthedocs.io/en/latest/spec/directives.html#version-and-platform-checks)\n"
  },
  {
    "name": "bad-version-info-comparison",
    "code": "PYI006",
    "explanation": "## What it does\nChecks for uses of comparators other than `<` and `>=` for\n`sys.version_info` checks. All other comparators, such\nas `>`, `<=`, and `==`, are banned.\n\n## Why is this bad?\nComparing `sys.version_info` with `==` or `<=` has unexpected behavior\nand can lead to bugs.\n\nFor example, `sys.version_info > (3, 8, 1)` will resolve to `True` if your\nPython version is 3.8.1; meanwhile, `sys.version_info <= (3, 8)` will _not_\nresolve to `True` if your Python version is 3.8.10:\n\n```python\n>>> import sys\n>>> print(sys.version_info)\nsys.version_info(major=3, minor=8, micro=10, releaselevel='final', serial=0)\n>>> print(sys.version_info > (3, 8))\nTrue\n>>> print(sys.version_info == (3, 8))\nFalse\n>>> print(sys.version_info <= (3, 8))\nFalse\n>>> print(sys.version_info in (3, 8))\nFalse\n```\n\n## Example\n```py\nimport sys\n\nif sys.version_info > (3, 8): ...\n```\n\nUse instead:\n```py\nimport sys\n\nif sys.version_info >= (3, 9): ...\n```\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "unrecognized-platform-check",
    "code": "PYI007",
    "explanation": "## What it does\nCheck for unrecognized `sys.platform` checks. Platform checks should be\nsimple string comparisons.\n\n**Note**: this rule is only enabled in `.pyi` stub files.\n\n## Why is this bad?\nSome `sys.platform` checks are too complex for type checkers to\nunderstand, and thus result in incorrect inferences by these tools.\n`sys.platform` checks should be simple string comparisons, like\n`if sys.platform == \"linux\"`.\n\n## Example\n```pyi\nif sys.platform.startswith(\"linux\"):\n    # Linux specific definitions\n    ...\nelse:\n    # Posix specific definitions\n    ...\n```\n\nInstead, use a simple string comparison, such as `==` or `!=`:\n```pyi\nif sys.platform == \"linux\":\n    # Linux specific definitions\n    ...\nelse:\n    # Posix specific definitions\n    ...\n```\n\n## References\n- [Typing documentation: Version and Platform checking](https://typing.readthedocs.io/en/latest/spec/directives.html#version-and-platform-checks)\n"
  },
  {
    "name": "unrecognized-platform-name",
    "code": "PYI008",
    "explanation": "## What it does\nCheck for unrecognized platform names in `sys.platform` checks.\n\n**Note**: this rule is only enabled in `.pyi` stub files.\n\n## Why is this bad?\nIf a `sys.platform` check compares to a platform name outside of a\nsmall set of known platforms (e.g. \"linux\", \"win32\", etc.), it's likely\na typo or a platform name that is not recognized by type checkers.\n\nThe list of known platforms is: \"linux\", \"win32\", \"cygwin\", \"darwin\".\n\n## Example\n```pyi\nif sys.platform == \"linus\": ...\n```\n\nUse instead:\n```pyi\nif sys.platform == \"linux\": ...\n```\n\n## References\n- [Typing documentation: Version and Platform checking](https://typing.readthedocs.io/en/latest/spec/directives.html#version-and-platform-checks)\n"
  },
  {
    "name": "pass-statement-stub-body",
    "code": "PYI009",
    "explanation": "## What it does\nChecks for `pass` statements in empty stub bodies.\n\n## Why is this bad?\nFor stylistic consistency, `...` should always be used rather than `pass`\nin stub files.\n\n## Example\n```pyi\ndef foo(bar: int) -> list[int]: pass\n```\n\nUse instead:\n```pyi\ndef foo(bar: int) -> list[int]: ...\n```\n\n## References\n- [Typing documentation - Writing and Maintaining Stub Files](https://typing.readthedocs.io/en/latest/guides/writing_stubs.html)\n",
    "fix": 2
  },
  {
    "name": "non-empty-stub-body",
    "code": "PYI010",
    "explanation": "## What it does\nChecks for non-empty function stub bodies.\n\n## Why is this bad?\nStub files are never executed at runtime; they should be thought of as\n\"data files\" for type checkers or IDEs. Function bodies are redundant\nfor this purpose.\n\n## Example\n```pyi\ndef double(x: int) -> int:\n    return x * 2\n```\n\nUse instead:\n```pyi\ndef double(x: int) -> int: ...\n```\n\n## References\n- [Typing documentation - Writing and Maintaining Stub Files](https://typing.readthedocs.io/en/latest/guides/writing_stubs.html)\n",
    "fix": 2
  },
  {
    "name": "typed-argument-default-in-stub",
    "code": "PYI011",
    "explanation": "## What it does\nChecks for typed function arguments in stubs with complex default values.\n\n## Why is this bad?\nStub (`.pyi`) files exist as \"data files\" for static analysis tools, and\nare not evaluated at runtime. While simple default values may be useful for\nsome tools that consume stubs, such as IDEs, they are ignored by type\ncheckers.\n\nInstead of including and reproducing a complex value, use `...` to indicate\nthat the assignment has a default value, but that the value is \"complex\" or\nvaries according to the current platform or Python version. For the\npurposes of this rule, any default value counts as \"complex\" unless it is\na literal `int`, `float`, `complex`, `bytes`, `str`, `bool`, `None`, `...`,\nor a simple container literal.\n\n## Example\n\n```pyi\ndef foo(arg: list[int] = list(range(10_000))) -> None: ...\n```\n\nUse instead:\n\n```pyi\ndef foo(arg: list[int] = ...) -> None: ...\n```\n\n## References\n- [`flake8-pyi`](https://github.com/PyCQA/flake8-pyi/blob/main/ERRORCODES.md)\n",
    "fix": 2
  },
  {
    "name": "pass-in-class-body",
    "code": "PYI012",
    "explanation": "## What it does\nChecks for the presence of the `pass` statement in non-empty class bodies\nin `.pyi` files.\n\n## Why is this bad?\nThe `pass` statement is always unnecessary in non-empty class bodies in\nstubs.\n\n## Example\n```pyi\nclass MyClass:\n    x: int\n    pass\n```\n\nUse instead:\n```pyi\nclass MyClass:\n    x: int\n```\n",
    "fix": 2
  },
  {
    "name": "ellipsis-in-non-empty-class-body",
    "code": "PYI013",
    "explanation": "## What it does\nRemoves ellipses (`...`) in otherwise non-empty class bodies.\n\n## Why is this bad?\nAn ellipsis in a class body is only necessary if the class body is\notherwise empty. If the class body is non-empty, then the ellipsis\nis redundant.\n\n## Example\n```pyi\nclass Foo:\n    ...\n    value: int\n```\n\nUse instead:\n```pyi\nclass Foo:\n    value: int\n```\n",
    "fix": 1
  },
  {
    "name": "argument-default-in-stub",
    "code": "PYI014",
    "explanation": "## What it does\nChecks for untyped function arguments in stubs with default values that\nare not \"simple\" /// (i.e., `int`, `float`, `complex`, `bytes`, `str`,\n`bool`, `None`, `...`, or simple container literals).\n\n## Why is this bad?\nStub (`.pyi`) files exist to define type hints, and are not evaluated at\nruntime. As such, function arguments in stub files should not have default\nvalues, as they are ignored by type checkers.\n\nHowever, the use of default values may be useful for IDEs and other\nconsumers of stub files, and so \"simple\" values may be worth including and\nare permitted by this rule.\n\nInstead of including and reproducing a complex value, use `...` to indicate\nthat the assignment has a default value, but that the value is non-simple\nor varies according to the current platform or Python version.\n\n## Example\n\n```pyi\ndef foo(arg=[]) -> None: ...\n```\n\nUse instead:\n\n```pyi\ndef foo(arg=...) -> None: ...\n```\n\n## References\n- [`flake8-pyi`](https://github.com/PyCQA/flake8-pyi/blob/main/ERRORCODES.md)\n",
    "fix": 2
  },
  {
    "name": "assignment-default-in-stub",
    "code": "PYI015",
    "explanation": "## What it does\nChecks for assignments in stubs with default values that are not \"simple\"\n(i.e., `int`, `float`, `complex`, `bytes`, `str`, `bool`, `None`, `...`, or\nsimple container literals).\n\n## Why is this bad?\nStub (`.pyi`) files exist to define type hints, and are not evaluated at\nruntime. As such, assignments in stub files should not include values,\nas they are ignored by type checkers.\n\nHowever, the use of such values may be useful for IDEs and other consumers\nof stub files, and so \"simple\" values may be worth including and are\npermitted by this rule.\n\nInstead of including and reproducing a complex value, use `...` to indicate\nthat the assignment has a default value, but that the value is non-simple\nor varies according to the current platform or Python version.\n\n## Example\n```pyi\nfoo: str = \"...\"\n```\n\nUse instead:\n```pyi\nfoo: str = ...\n```\n\n## References\n- [`flake8-pyi`](https://github.com/PyCQA/flake8-pyi/blob/main/ERRORCODES.md)\n",
    "fix": 2
  },
  {
    "name": "duplicate-union-member",
    "code": "PYI016",
    "explanation": "## What it does\nChecks for duplicate union members.\n\n## Why is this bad?\nDuplicate union members are redundant and should be removed.\n\n## Example\n```python\nfoo: str | str\n```\n\nUse instead:\n```python\nfoo: str\n```\n\n## Fix safety\nThis rule's fix is marked as safe unless the union contains comments.\n\nFor nested union, the fix will flatten type expressions into a single\ntop-level union.\n\n## References\n- [Python documentation: `typing.Union`](https://docs.python.org/3/library/typing.html#typing.Union)\n",
    "fix": 1
  },
  {
    "name": "complex-assignment-in-stub",
    "code": "PYI017",
    "explanation": "## What it does\nChecks for assignments with multiple or non-name targets in stub files.\n\n## Why is this bad?\nIn general, stub files should be thought of as \"data files\" for a type\nchecker, and are not intended to be executed. As such, it's useful to\nenforce that only a subset of Python syntax is allowed in a stub file, to\nensure that everything in the stub is unambiguous for the type checker.\n\nThe need to perform multi-assignment, or assignment to a non-name target,\nlikely indicates a misunderstanding of how stub files are intended to be\nused.\n\n## Example\n\n```pyi\nfrom typing import TypeAlias\n\na = b = int\n\nclass Klass: ...\n\nKlass.X: TypeAlias = int\n```\n\nUse instead:\n\n```pyi\nfrom typing import TypeAlias\n\na: TypeAlias = int\nb: TypeAlias = int\n\nclass Klass:\n    X: TypeAlias = int\n```\n"
  },
  {
    "name": "unused-private-type-var",
    "code": "PYI018",
    "explanation": "## What it does\nChecks for the presence of unused private `TypeVar`, `ParamSpec` or\n`TypeVarTuple` declarations.\n\n## Why is this bad?\nA private `TypeVar` that is defined but not used is likely a mistake. It\nshould either be used, made public, or removed to avoid confusion. A type\nvariable is considered \"private\" if its name starts with an underscore.\n\n## Example\n```pyi\nimport typing\nimport typing_extensions\n\n_T = typing.TypeVar(\"_T\")\n_Ts = typing_extensions.TypeVarTuple(\"_Ts\")\n```\n\n## Fix safety\nThe fix is always marked as unsafe, as it would break your code if the type\nvariable is imported by another module.\n",
    "fix": 1
  },
  {
    "name": "custom-type-var-for-self",
    "code": "PYI019",
    "explanation": "## What it does\nChecks for methods that use custom [`TypeVar`s][typing_TypeVar] in their\nannotations when they could use [`Self`][Self] instead.\n\n## Why is this bad?\nWhile the semantics are often identical, using `Self` is more intuitive\nand succinct (per [PEP 673]) than a custom `TypeVar`. For example, the\nuse of `Self` will typically allow for the omission of type parameters\non the `self` and `cls` arguments.\n\nThis check currently applies to instance methods that return `self`,\nclass methods that return an instance of `cls`, class methods that return\n`cls`, and `__new__` methods.\n\n## Example\n\n```pyi\nfrom typing import TypeVar\n\n_S = TypeVar(\"_S\", bound=\"Foo\")\n\nclass Foo:\n    def __new__(cls: type[_S], *args: str, **kwargs: int) -> _S: ...\n    def foo(self: _S, arg: bytes) -> _S: ...\n    @classmethod\n    def bar(cls: type[_S], arg: int) -> _S: ...\n```\n\nUse instead:\n\n```pyi\nfrom typing import Self\n\nclass Foo:\n    def __new__(cls, *args: str, **kwargs: int) -> Self: ...\n    def foo(self, arg: bytes) -> Self: ...\n    @classmethod\n    def bar(cls, arg: int) -> Self: ...\n```\n\n## Fix behaviour and safety\nThe fix replaces all references to the custom type variable in the method's header and body\nwith references to `Self`. The fix also adds an import of `Self` if neither `Self` nor `typing`\nis already imported in the module. If your [`target-version`] setting is set to Python 3.11 or\nnewer, the fix imports `Self` from the standard-library `typing` module; otherwise, the fix\nimports `Self` from the third-party [`typing_extensions`][typing_extensions] backport package.\n\nIf the custom type variable is a [PEP-695]-style `TypeVar`, the fix also removes the `TypeVar`\ndeclaration from the method's [type parameter list]. However, if the type variable is an\nold-style `TypeVar`, the declaration of the type variable will not be removed by this rule's\nfix, as the type variable could still be used by other functions, methods or classes. See\n[`unused-private-type-var`][PYI018] for a rule that will clean up unused private type\nvariables.\n\nThe fix is only marked as unsafe if there is the possibility that it might delete a comment\nfrom your code.\n\n[PEP 673]: https://peps.python.org/pep-0673/#motivation\n[PEP-695]: https://peps.python.org/pep-0695/\n[PYI018]: https://docs.astral.sh/ruff/rules/unused-private-type-var/\n[type parameter list]: https://docs.python.org/3/reference/compound_stmts.html#type-params\n[Self]: https://docs.python.org/3/library/typing.html#typing.Self\n[typing_TypeVar]: https://docs.python.org/3/library/typing.html#typing.TypeVar\n[typing_extensions]: https://typing-extensions.readthedocs.io/en/latest/\n",
    "fix": 1
  },
  {
    "name": "quoted-annotation-in-stub",
    "code": "PYI020",
    "explanation": "## What it does\nChecks for quoted type annotations in stub (`.pyi`) files, which should be avoided.\n\n## Why is this bad?\nStub files natively support forward references in all contexts, as stubs\nare never executed at runtime. (They should be thought of as \"data files\"\nfor type checkers and IDEs.) As such, quotes are never required for type\nannotations in stub files, and should be omitted.\n\n## Example\n\n```pyi\ndef function() -> \"int\": ...\n```\n\nUse instead:\n\n```pyi\ndef function() -> int: ...\n```\n\n## References\n- [Typing documentation - Writing and Maintaining Stub Files](https://typing.readthedocs.io/en/latest/guides/writing_stubs.html)\n",
    "fix": 2
  },
  {
    "name": "docstring-in-stub",
    "code": "PYI021",
    "explanation": "## What it does\nChecks for the presence of docstrings in stub files.\n\n## Why is this bad?\nStub files should omit docstrings, as they're intended to provide type\nhints, rather than documentation.\n\n## Example\n\n```pyi\ndef func(param: int) -> str:\n    \"\"\"This is a docstring.\"\"\"\n    ...\n```\n\nUse instead:\n\n```pyi\ndef func(param: int) -> str: ...\n```\n",
    "fix": 2
  },
  {
    "name": "collections-named-tuple",
    "code": "PYI024",
    "explanation": "## What it does\nChecks for uses of `collections.namedtuple` in stub files.\n\n## Why is this bad?\n`typing.NamedTuple` is the \"typed version\" of `collections.namedtuple`.\n\nInheriting from `typing.NamedTuple` creates a custom `tuple` subclass in\nthe same way as using the `collections.namedtuple` factory function.\nHowever, using `typing.NamedTuple` allows you to provide a type annotation\nfor each field in the class. This means that type checkers will have more\ninformation to work with, and will be able to analyze your code more\nprecisely.\n\n## Example\n```pyi\nfrom collections import namedtuple\n\nperson = namedtuple(\"Person\", [\"name\", \"age\"])\n```\n\nUse instead:\n```pyi\nfrom typing import NamedTuple\n\nclass Person(NamedTuple):\n    name: str\n    age: int\n```\n"
  },
  {
    "name": "unaliased-collections-abc-set-import",
    "code": "PYI025",
    "explanation": "## What it does\nChecks for `from collections.abc import Set` imports that do not alias\n`Set` to `AbstractSet`.\n\n## Why is this bad?\nThe `Set` type in `collections.abc` is an abstract base class for set-like types.\nIt is easily confused with, and not equivalent to, the `set` builtin.\n\nTo avoid confusion, `Set` should be aliased to `AbstractSet` when imported. This\nmakes it clear that the imported type is an abstract base class, and not the\n`set` builtin.\n\n## Example\n```pyi\nfrom collections.abc import Set\n```\n\nUse instead:\n```pyi\nfrom collections.abc import Set as AbstractSet\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe for `Set` imports defined at the\ntop-level of a `.py` module. Top-level symbols are implicitly exported by the\nmodule, and so renaming a top-level symbol may break downstream modules\nthat import it.\n\nThe same is not true for `.pyi` files, where imported symbols are only\nre-exported if they are included in `__all__`, use a \"redundant\"\n`import foo as foo` alias, or are imported via a `*` import. As such, the\nfix is marked as safe in more cases for `.pyi` files.\n",
    "fix": 1
  },
  {
    "name": "type-alias-without-annotation",
    "code": "PYI026",
    "explanation": "## What it does\nChecks for type alias definitions that are not annotated with\n`typing.TypeAlias`.\n\n## Why is this bad?\nIn Python, a type alias is defined by assigning a type to a variable (e.g.,\n`Vector = list[float]`).\n\nIt's best to annotate type aliases with the `typing.TypeAlias` type to\nmake it clear that the statement is a type alias declaration, as opposed\nto a normal variable assignment.\n\n## Example\n```pyi\nVector = list[float]\n```\n\nUse instead:\n```pyi\nfrom typing import TypeAlias\n\nVector: TypeAlias = list[float]\n```\n",
    "fix": 2
  },
  {
    "name": "str-or-repr-defined-in-stub",
    "code": "PYI029",
    "explanation": "## What it does\nChecks for redundant definitions of `__str__` or `__repr__` in stubs.\n\n## Why is this bad?\nDefining `__str__` or `__repr__` in a stub is almost always redundant,\nas the signatures are almost always identical to those of the default\nequivalent, `object.__str__` and `object.__repr__`, respectively.\n\n## Example\n\n```pyi\nclass Foo:\n    def __repr__(self) -> str: ...\n```\n",
    "fix": 2
  },
  {
    "name": "unnecessary-literal-union",
    "code": "PYI030",
    "explanation": "## What it does\nChecks for the presence of multiple literal types in a union.\n\n## Why is this bad?\n`Literal[\"foo\", 42]` has identical semantics to\n`Literal[\"foo\"] | Literal[42]`, but is clearer and more concise.\n\n## Example\n```pyi\nfrom typing import Literal\n\nfield: Literal[1] | Literal[2] | str\n```\n\nUse instead:\n```pyi\nfrom typing import Literal\n\nfield: Literal[1, 2] | str\n```\n\n## Fix safety\nThis fix is marked unsafe if it would delete any comments within the replacement range.\n\nAn example to illustrate where comments are preserved and where they are not:\n\n```pyi\nfrom typing import Literal\n\nfield: (\n    # deleted comment\n    Literal[\"a\", \"b\"]  # deleted comment\n    # deleted comment\n    | Literal[\"c\", \"d\"]  # preserved comment\n)\n```\n\n## References\n- [Python documentation: `typing.Literal`](https://docs.python.org/3/library/typing.html#typing.Literal)\n",
    "fix": 1
  },
  {
    "name": "any-eq-ne-annotation",
    "code": "PYI032",
    "explanation": "## What it does\nChecks for `__eq__` and `__ne__` implementations that use `typing.Any` as\nthe type annotation for their second parameter.\n\n## Why is this bad?\nThe Python documentation recommends the use of `object` to \"indicate that a\nvalue could be any type in a typesafe manner\". `Any`, on the other hand,\nshould be seen as an \"escape hatch when you need to mix dynamically and\nstatically typed code\". Since using `Any` allows you to write highly unsafe\ncode, you should generally only use `Any` when the semantics of your code\nwould otherwise be inexpressible to the type checker.\n\nThe expectation in Python is that a comparison of two arbitrary objects\nusing `==` or `!=` should never raise an exception. This contract can be\nfully expressed in the type system and does not involve requesting unsound\nbehaviour from a type checker. As such, `object` is a more appropriate\nannotation than `Any` for the second parameter of the methods implementing\nthese comparison operators -- `__eq__` and `__ne__`.\n\n## Example\n\n```pyi\nclass Foo:\n    def __eq__(self, obj: typing.Any) -> bool: ...\n```\n\nUse instead:\n\n```pyi\nclass Foo:\n    def __eq__(self, obj: object) -> bool: ...\n```\n## References\n- [Python documentation: The `Any` type](https://docs.python.org/3/library/typing.html#the-any-type)\n- [Mypy documentation: Any vs. object](https://mypy.readthedocs.io/en/latest/dynamic_typing.html#any-vs-object)\n",
    "fix": 2
  },
  {
    "name": "type-comment-in-stub",
    "code": "PYI033",
    "explanation": "## What it does\nChecks for the use of type comments (e.g., `x = 1  # type: int`) in stub\nfiles.\n\n## Why is this bad?\nStub (`.pyi`) files should use type annotations directly, rather\nthan type comments, even if they're intended to support Python 2, since\nstub files are not executed at runtime. The one exception is `# type: ignore`.\n\n## Example\n```pyi\nx = 1  # type: int\n```\n\nUse instead:\n```pyi\nx: int = 1\n```\n"
  },
  {
    "name": "non-self-return-type",
    "code": "PYI034",
    "explanation": "## What it does\nChecks for methods that are annotated with a fixed return type which\nshould instead be returning `Self`.\n\n## Why is this bad?\nIf methods that generally return `self` at runtime are annotated with a\nfixed return type, and the class is subclassed, type checkers will not be\nable to infer the correct return type.\n\nFor example:\n```python\nclass Shape:\n    def set_scale(self, scale: float) -> Shape:\n        self.scale = scale\n        return self\n\nclass Circle(Shape):\n    def set_radius(self, radius: float) -> Circle:\n        self.radius = radius\n        return self\n\n# Type checker infers return type as `Shape`, not `Circle`.\nCircle().set_scale(0.5)\n\n# Thus, this expression is invalid, as `Shape` has no attribute `set_radius`.\nCircle().set_scale(0.5).set_radius(2.7)\n```\n\nSpecifically, this check enforces that the return type of the following\nmethods is `Self`:\n\n1. In-place binary-operation dunder methods, like `__iadd__`, `__imul__`, etc.\n1. `__new__`, `__enter__`, and `__aenter__`, if those methods return the\n   class name.\n1. `__iter__` methods that return `Iterator`, despite the class inheriting\n   directly from `Iterator`.\n1. `__aiter__` methods that return `AsyncIterator`, despite the class\n   inheriting directly from `AsyncIterator`.\n\n## Example\n\n```pyi\nclass Foo:\n    def __new__(cls, *args: Any, **kwargs: Any) -> Foo: ...\n    def __enter__(self) -> Foo: ...\n    async def __aenter__(self) -> Foo: ...\n    def __iadd__(self, other: Foo) -> Foo: ...\n```\n\nUse instead:\n\n```pyi\nfrom typing_extensions import Self\n\nclass Foo:\n    def __new__(cls, *args: Any, **kwargs: Any) -> Self: ...\n    def __enter__(self) -> Self: ...\n    async def __aenter__(self) -> Self: ...\n    def __iadd__(self, other: Foo) -> Self: ...\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe as it changes the meaning of your type annotations.\n\n## References\n- [Python documentation: `typing.Self`](https://docs.python.org/3/library/typing.html#typing.Self)\n",
    "fix": 1
  },
  {
    "name": "unassigned-special-variable-in-stub",
    "code": "PYI035",
    "explanation": "## What it does\nChecks that `__all__`, `__match_args__`, and `__slots__` variables are\nassigned to values when defined in stub files.\n\n## Why is this bad?\nSpecial variables like `__all__` have the same semantics in stub files\nas they do in Python modules, and so should be consistent with their\nruntime counterparts.\n\n## Example\n```pyi\n__all__: list[str]\n```\n\nUse instead:\n```pyi\n__all__: list[str] = [\"foo\", \"bar\"]\n```\n"
  },
  {
    "name": "bad-exit-annotation",
    "code": "PYI036",
    "explanation": "## What it does\nChecks for incorrect function signatures on `__exit__` and `__aexit__`\nmethods.\n\n## Why is this bad?\nImproperly annotated `__exit__` and `__aexit__` methods can cause\nunexpected behavior when interacting with type checkers.\n\n## Example\n\n```pyi\nfrom types import TracebackType\n\nclass Foo:\n    def __exit__(\n        self, typ: BaseException, exc: BaseException, tb: TracebackType\n    ) -> None: ...\n```\n\nUse instead:\n\n```pyi\nfrom types import TracebackType\n\nclass Foo:\n    def __exit__(\n        self,\n        typ: type[BaseException] | None,\n        exc: BaseException | None,\n        tb: TracebackType | None,\n    ) -> None: ...\n```\n",
    "fix": 1
  },
  {
    "name": "redundant-numeric-union",
    "code": "PYI041",
    "explanation": "## What it does\nChecks for parameter annotations that contain redundant unions between\nbuiltin numeric types (e.g., `int | float`).\n\n## Why is this bad?\nThe [typing specification] states:\n\n> Python\u2019s numeric types `complex`, `float` and `int` are not subtypes of\n> each other, but to support common use cases, the type system contains a\n> straightforward shortcut: when an argument is annotated as having type\n> `float`, an argument of type `int` is acceptable; similar, for an\n> argument annotated as having type `complex`, arguments of type `float` or\n> `int` are acceptable.\n\nAs such, a union that includes both `int` and `float` is redundant in the\nspecific context of a parameter annotation, as it is equivalent to a union\nthat only includes `float`. For readability and clarity, unions should omit\nredundant elements.\n\n## Example\n\n```pyi\ndef foo(x: float | int | str) -> None: ...\n```\n\nUse instead:\n\n```pyi\ndef foo(x: float | str) -> None: ...\n```\n\n## Fix safety\nThis rule's fix is marked as safe, unless the type annotation contains comments.\n\nNote that while the fix may flatten nested unions into a single top-level union,\nthe semantics of the annotation will remain unchanged.\n\n## References\n- [Python documentation: The numeric tower](https://docs.python.org/3/library/numbers.html#the-numeric-tower)\n- [PEP 484: The numeric tower](https://peps.python.org/pep-0484/#the-numeric-tower)\n\n[typing specification]: https://typing.readthedocs.io/en/latest/spec/special-types.html#special-cases-for-float-and-complex\n",
    "fix": 1
  },
  {
    "name": "snake-case-type-alias",
    "code": "PYI042",
    "explanation": "## What it does\nChecks for type aliases that do not use the CamelCase naming convention.\n\n## Why is this bad?\nIt's conventional to use the CamelCase naming convention for type aliases,\nto distinguish them from other variables.\n\n## Example\n```pyi\ntype_alias_name: TypeAlias = int\n```\n\nUse instead:\n```pyi\nTypeAliasName: TypeAlias = int\n```\n"
  },
  {
    "name": "t-suffixed-type-alias",
    "code": "PYI043",
    "explanation": "## What it does\nChecks for private type alias definitions suffixed with 'T'.\n\n## Why is this bad?\nIt's conventional to use the 'T' suffix for type variables; the use of\nsuch a suffix implies that the object is a `TypeVar`.\n\nAdding the 'T' suffix to a non-`TypeVar`, it can be misleading and should\nbe avoided.\n\n## Example\n```pyi\nfrom typing import TypeAlias\n\n_MyTypeT: TypeAlias = int\n```\n\nUse instead:\n```pyi\nfrom typing import TypeAlias\n\n_MyType: TypeAlias = int\n```\n\n## References\n- [PEP 484: Type Aliases](https://peps.python.org/pep-0484/#type-aliases)\n"
  },
  {
    "name": "future-annotations-in-stub",
    "code": "PYI044",
    "explanation": "## What it does\nChecks for the presence of the `from __future__ import annotations` import\nstatement in stub files.\n\n## Why is this bad?\nStub files natively support forward references in all contexts, as stubs are\nnever executed at runtime. (They should be thought of as \"data files\" for\ntype checkers.) As such, the `from __future__ import annotations` import\nstatement has no effect and should be omitted.\n\n## References\n- [Static Typing with Python: Type Stubs](https://typing.readthedocs.io/en/latest/source/stubs.html)\n",
    "fix": 1
  },
  {
    "name": "iter-method-return-iterable",
    "code": "PYI045",
    "explanation": "## What it does\nChecks for `__iter__` methods in stubs that return `Iterable[T]` instead\nof an `Iterator[T]`.\n\n## Why is this bad?\n`__iter__` methods should always should return an `Iterator` of some kind,\nnot an `Iterable`.\n\nIn Python, an `Iterable` is an object that has an `__iter__` method; an\n`Iterator` is an object that has `__iter__` and `__next__` methods. All\n`__iter__` methods are expected to return `Iterator`s. Type checkers may\nnot always recognize an object as being iterable if its `__iter__` method\ndoes not return an `Iterator`.\n\nEvery `Iterator` is an `Iterable`, but not every `Iterable` is an `Iterator`.\nFor example, `list` is an `Iterable`, but not an `Iterator`; you can obtain\nan iterator over a list's elements by passing the list to `iter()`:\n\n```pycon\n>>> import collections.abc\n>>> x = [42]\n>>> isinstance(x, collections.abc.Iterable)\nTrue\n>>> isinstance(x, collections.abc.Iterator)\nFalse\n>>> next(x)\nTraceback (most recent call last):\n File \"<stdin>\", line 1, in <module>\nTypeError: 'list' object is not an iterator\n>>> y = iter(x)\n>>> isinstance(y, collections.abc.Iterable)\nTrue\n>>> isinstance(y, collections.abc.Iterator)\nTrue\n>>> next(y)\n42\n```\n\nUsing `Iterable` rather than `Iterator` as a return type for an `__iter__`\nmethods would imply that you would not necessarily be able to call `next()`\non the returned object, violating the expectations of the interface.\n\n## Example\n\n```python\nimport collections.abc\n\n\nclass Klass:\n    def __iter__(self) -> collections.abc.Iterable[str]: ...\n```\n\nUse instead:\n\n```python\nimport collections.abc\n\n\nclass Klass:\n    def __iter__(self) -> collections.abc.Iterator[str]: ...\n```\n"
  },
  {
    "name": "unused-private-protocol",
    "code": "PYI046",
    "explanation": "## What it does\nChecks for the presence of unused private `typing.Protocol` definitions.\n\n## Why is this bad?\nA private `typing.Protocol` that is defined but not used is likely a\nmistake. It should either be used, made public, or removed to avoid\nconfusion.\n\n## Example\n\n```pyi\nimport typing\n\nclass _PrivateProtocol(typing.Protocol):\n    foo: int\n```\n\nUse instead:\n\n```pyi\nimport typing\n\nclass _PrivateProtocol(typing.Protocol):\n    foo: int\n\ndef func(arg: _PrivateProtocol) -> None: ...\n```\n"
  },
  {
    "name": "unused-private-type-alias",
    "code": "PYI047",
    "explanation": "## What it does\nChecks for the presence of unused private type aliases.\n\n## Why is this bad?\nA private type alias that is defined but not used is likely a\nmistake. It should either be used, made public, or removed to avoid\nconfusion.\n\n## Example\n\n```pyi\nimport typing\n\n_UnusedTypeAlias: typing.TypeAlias = int\n```\n\nUse instead:\n\n```pyi\nimport typing\n\n_UsedTypeAlias: typing.TypeAlias = int\n\ndef func(arg: _UsedTypeAlias) -> _UsedTypeAlias: ...\n```\n"
  },
  {
    "name": "stub-body-multiple-statements",
    "code": "PYI048",
    "explanation": "## What it does\nChecks for functions in stub (`.pyi`) files that contain multiple\nstatements.\n\n## Why is this bad?\nStub files are never executed, and are only intended to define type hints.\nAs such, functions in stub files should not contain functional code, and\nshould instead contain only a single statement (e.g., `...`).\n\n## Example\n\n```pyi\ndef function():\n    x = 1\n    y = 2\n    return x + y\n```\n\nUse instead:\n\n```pyi\ndef function(): ...\n```\n"
  },
  {
    "name": "unused-private-typed-dict",
    "code": "PYI049",
    "explanation": "## What it does\nChecks for the presence of unused private `typing.TypedDict` definitions.\n\n## Why is this bad?\nA private `typing.TypedDict` that is defined but not used is likely a\nmistake. It should either be used, made public, or removed to avoid\nconfusion.\n\n## Example\n\n```pyi\nimport typing\n\nclass _UnusedPrivateTypedDict(typing.TypedDict):\n    foo: list[int]\n```\n\nUse instead:\n\n```pyi\nimport typing\n\nclass _UsedPrivateTypedDict(typing.TypedDict):\n    foo: set[str]\n\ndef func(arg: _UsedPrivateTypedDict) -> _UsedPrivateTypedDict: ...\n```\n"
  },
  {
    "name": "no-return-argument-annotation-in-stub",
    "code": "PYI050",
    "explanation": "## What it does\nChecks for uses of `typing.NoReturn` (and `typing_extensions.NoReturn`) for\nparameter annotations.\n\n## Why is this bad?\nPrefer `Never` over `NoReturn` for parameter annotations. `Never` has a\nclearer name in these contexts, since it makes little sense to talk about a\nparameter annotation \"not returning\".\n\nThis is a purely stylistic lint: the two types have identical semantics for\ntype checkers. Both represent Python's \"[bottom type]\" (a type that has no\nmembers).\n\n## Example\n```pyi\nfrom typing import NoReturn\n\ndef foo(x: NoReturn): ...\n```\n\nUse instead:\n```pyi\nfrom typing import Never\n\ndef foo(x: Never): ...\n```\n\n## References\n- [Python documentation: `typing.Never`](https://docs.python.org/3/library/typing.html#typing.Never)\n- [Python documentation: `typing.NoReturn`](https://docs.python.org/3/library/typing.html#typing.NoReturn)\n\n[bottom type]: https://en.wikipedia.org/wiki/Bottom_type\n"
  },
  {
    "name": "redundant-literal-union",
    "code": "PYI051",
    "explanation": "## What it does\nChecks for redundant unions between a `Literal` and a builtin supertype of\nthat `Literal`.\n\n## Why is this bad?\nUsing a `Literal` type in a union with its builtin supertype is redundant,\nas the supertype will be strictly more general than the `Literal` type.\nFor example, `Literal[\"A\"] | str` is equivalent to `str`, and\n`Literal[1] | int` is equivalent to `int`, as `str` and `int` are the\nsupertypes of `\"A\"` and `1` respectively.\n\n## Example\n```pyi\nfrom typing import Literal\n\nx: Literal[\"A\", b\"B\"] | str\n```\n\nUse instead:\n```pyi\nfrom typing import Literal\n\nx: Literal[b\"B\"] | str\n```\n"
  },
  {
    "name": "unannotated-assignment-in-stub",
    "code": "PYI052",
    "explanation": "## What it does\nChecks for unannotated assignments in stub (`.pyi`) files.\n\n## Why is this bad?\nStub files exist to provide type hints, and are never executed. As such,\nall assignments in stub files should be annotated with a type.\n"
  },
  {
    "name": "string-or-bytes-too-long",
    "code": "PYI053",
    "explanation": "## What it does\nChecks for the use of string and bytes literals longer than 50 characters\nin stub (`.pyi`) files.\n\n## Why is this bad?\nIf a function or variable has a default value where the string or bytes\nrepresentation is greater than 50 characters long, it is likely to be an\nimplementation detail or a constant that varies depending on the system\nyou're running on.\n\nAlthough IDEs may find them useful, default values are ignored by type\ncheckers, the primary consumers of stub files. Replace very long constants\nwith ellipses (`...`) to simplify the stub.\n\n## Example\n\n```pyi\ndef foo(arg: str = \"51 character stringgggggggggggggggggggggggggggggggg\") -> None: ...\n```\n\nUse instead:\n\n```pyi\ndef foo(arg: str = ...) -> None: ...\n```\n",
    "fix": 2
  },
  {
    "name": "numeric-literal-too-long",
    "code": "PYI054",
    "explanation": "## What it does\nChecks for numeric literals with a string representation longer than ten\ncharacters.\n\n## Why is this bad?\nIf a function has a default value where the literal representation is\ngreater than 10 characters, the value is likely to be an implementation\ndetail or a constant that varies depending on the system you're running on.\n\nDefault values like these should generally be omitted from stubs. Use\nellipses (`...`) instead.\n\n## Example\n\n```pyi\ndef foo(arg: int = 693568516352839939918568862861217771399698285293568) -> None: ...\n```\n\nUse instead:\n\n```pyi\ndef foo(arg: int = ...) -> None: ...\n```\n",
    "fix": 2
  },
  {
    "name": "unnecessary-type-union",
    "code": "PYI055",
    "explanation": "## What it does\nChecks for the presence of multiple `type`s in a union.\n\n## Why is this bad?\n`type[T | S]` has identical semantics to `type[T] | type[S]` in a type\nannotation, but is cleaner and more concise.\n\n## Example\n```pyi\nfield: type[int] | type[float] | str\n```\n\nUse instead:\n```pyi\nfield: type[int | float] | str\n```\n\n## Fix safety\nThis rule's fix is marked as safe, unless the type annotation contains comments.\n\nNote that while the fix may flatten nested unions into a single top-level union,\nthe semantics of the annotation will remain unchanged.\n",
    "fix": 1
  },
  {
    "name": "unsupported-method-call-on-all",
    "code": "PYI056",
    "explanation": "## What it does\nChecks that `append`, `extend` and `remove` methods are not called on\n`__all__`.\n\n## Why is this bad?\nDifferent type checkers have varying levels of support for calling these\nmethods on `__all__`. Instead, use the `+=` operator to add items to\n`__all__`, which is known to be supported by all major type checkers.\n\n## Example\n```pyi\nimport sys\n\n__all__ = [\"A\", \"B\"]\n\nif sys.version_info >= (3, 10):\n    __all__.append(\"C\")\n\nif sys.version_info >= (3, 11):\n    __all__.remove(\"B\")\n```\n\nUse instead:\n```pyi\nimport sys\n\n__all__ = [\"A\"]\n\nif sys.version_info < (3, 11):\n    __all__ += [\"B\"]\n\nif sys.version_info >= (3, 10):\n    __all__ += [\"C\"]\n```\n"
  },
  {
    "name": "byte-string-usage",
    "code": "PYI057",
    "explanation": "## What it does\nChecks for uses of `typing.ByteString` or `collections.abc.ByteString`.\n\n## Why is this bad?\n`ByteString` has been deprecated since Python 3.9 and will be removed in\nPython 3.14. The Python documentation recommends using either\n`collections.abc.Buffer` (or the `typing_extensions` backport\non Python <3.12) or a union like `bytes | bytearray | memoryview` instead.\n\n## Example\n```python\nfrom typing import ByteString\n```\n\nUse instead:\n```python\nfrom collections.abc import Buffer\n```\n\n## References\n- [Python documentation: The `ByteString` type](https://docs.python.org/3/library/typing.html#typing.ByteString)\n"
  },
  {
    "name": "generator-return-from-iter-method",
    "code": "PYI058",
    "explanation": "## What it does\nChecks for simple `__iter__` methods that return `Generator`, and for\nsimple `__aiter__` methods that return `AsyncGenerator`.\n\n## Why is this bad?\nUsing `(Async)Iterator` for these methods is simpler and more elegant. More\nimportantly, it also reflects the fact that the precise kind of iterator\nreturned from an `__iter__` method is usually an implementation detail that\ncould change at any time. Type annotations help define a contract for a\nfunction; implementation details should not leak into that contract.\n\nFor example:\n```python\nfrom collections.abc import AsyncGenerator, Generator\nfrom typing import Any\n\n\nclass CustomIterator:\n    def __iter__(self) -> Generator:\n        yield from range(42)\n\n\nclass CustomIterator2:\n    def __iter__(self) -> Generator[str, Any, None]:\n        yield from \"abcdefg\"\n```\n\nUse instead:\n```python\nfrom collections.abc import Iterator\n\n\nclass CustomIterator:\n    def __iter__(self) -> Iterator:\n        yield from range(42)\n\n\nclass CustomIterator2:\n    def __iter__(self) -> Iterator[str]:\n        yield from \"abdefg\"\n```\n\n## Fix safety\nThis rule tries hard to avoid false-positive errors, and the rule's fix\nshould always be safe for `.pyi` stub files. However, there is a slightly\nhigher chance that a false positive might be emitted by this rule when\napplied to runtime Python (`.py` files). As such, the fix is marked as\nunsafe for any `__iter__` or `__aiter__` method in a `.py` file that has\nmore than two statements (including docstrings) in its body.\n",
    "fix": 1
  },
  {
    "name": "generic-not-last-base-class",
    "code": "PYI059",
    "explanation": "## What it does\nChecks for classes inheriting from `typing.Generic[]` where `Generic[]` is\nnot the last base class in the bases tuple.\n\n## Why is this bad?\nIf `Generic[]` is not the final class in the bases tuple, unexpected\nbehaviour can occur at runtime (See [this CPython issue][1] for an example).\nThe rule is also applied to stub files, but, unlike at runtime,\nin stubs it is purely enforced for stylistic consistency.\n\nFor example:\n```python\nclass LinkedList(Generic[T], Sized):\n    def push(self, item: T) -> None:\n        self._items.append(item)\n\nclass MyMapping(\n    Generic[K, V],\n    Iterable[Tuple[K, V]],\n    Container[Tuple[K, V]],\n):\n    ...\n```\n\nUse instead:\n```python\nclass LinkedList(Sized, Generic[T]):\n    def push(self, item: T) -> None:\n        self._items.append(item)\n\nclass MyMapping(\n    Iterable[Tuple[K, V]],\n    Container[Tuple[K, V]],\n    Generic[K, V],\n):\n    ...\n```\n## References\n- [`typing.Generic` documentation](https://docs.python.org/3/library/typing.html#typing.Generic)\n\n[1]: https://github.com/python/cpython/issues/106102\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "redundant-none-literal",
    "code": "PYI061",
    "explanation": "## What it does\nChecks for redundant `Literal[None]` annotations.\n\n## Why is this bad?\nWhile `Literal[None]` is a valid type annotation, it is semantically equivalent to `None`.\nPrefer `None` over `Literal[None]` for both consistency and readability.\n\n## Example\n```python\nfrom typing import Literal\n\nLiteral[None]\nLiteral[1, 2, 3, \"foo\", 5, None]\n```\n\nUse instead:\n```python\nfrom typing import Literal\n\nNone\nLiteral[1, 2, 3, \"foo\", 5] | None\n```\n\n## Fix safety and availability\nThis rule's fix is marked as safe unless the literal contains comments.\n\nThere is currently no fix available when applying the fix would lead to\na `TypeError` from an expression of the form `None | None` or when we\nare unable to import the symbol `typing.Optional` and the Python version\nis 3.9 or below.\n\n## References\n- [Typing documentation: Legal parameters for `Literal` at type check time](https://typing.readthedocs.io/en/latest/spec/literal.html#legal-parameters-for-literal-at-type-check-time)\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "duplicate-literal-member",
    "code": "PYI062",
    "explanation": "## What it does\nChecks for duplicate members in a `typing.Literal[]` slice.\n\n## Why is this bad?\nDuplicate literal members are redundant and should be removed.\n\n## Example\n```python\nfoo: Literal[\"a\", \"b\", \"a\"]\n```\n\nUse instead:\n```python\nfoo: Literal[\"a\", \"b\"]\n```\n\n## Fix safety\nThis rule's fix is marked as safe, unless the type annotation contains comments.\n\nNote that while the fix may flatten nested literals into a single top-level literal,\nthe semantics of the annotation will remain unchanged.\n\n## References\n- [Python documentation: `typing.Literal`](https://docs.python.org/3/library/typing.html#typing.Literal)\n",
    "fix": 2
  },
  {
    "name": "pep484-style-positional-only-parameter",
    "code": "PYI063",
    "explanation": "## What it does\nChecks for the presence of [PEP 484]-style positional-only parameters.\n\n## Why is this bad?\nHistorically, [PEP 484] recommended prefixing parameter names with double\nunderscores (`__`) to indicate to a type checker that they were\npositional-only. However, [PEP 570] (introduced in Python 3.8) introduced\ndedicated syntax for positional-only arguments. If a forward slash (`/`) is\npresent in a function signature on Python 3.8+, all parameters prior to the\nslash are interpreted as positional-only.\n\nThe new syntax should be preferred as it is more widely used, more concise\nand more readable. It is also respected by Python at runtime, whereas the\nold-style syntax was only understood by type checkers.\n\n## Example\n\n```pyi\ndef foo(__x: int) -> None: ...\n```\n\nUse instead:\n\n```pyi\ndef foo(x: int, /) -> None: ...\n```\n\n## Options\n- `target-version`\n\n[PEP 484]: https://peps.python.org/pep-0484/#positional-only-arguments\n[PEP 570]: https://peps.python.org/pep-0570\n"
  },
  {
    "name": "redundant-final-literal",
    "code": "PYI064",
    "explanation": "## What it does\nChecks for redundant `Final[Literal[...]]` annotations.\n\n## Why is this bad?\nAll constant variables annotated as `Final` are understood as implicitly\nhaving `Literal` types by a type checker. As such, a `Final[Literal[...]]`\nannotation can often be replaced with a bare `Final`, annotation, which\nwill have the same meaning to the type checker while being more concise and\nmore readable.\n\n## Example\n\n```pyi\nfrom typing import Final, Literal\n\nx: Final[Literal[42]]\ny: Final[Literal[42]] = 42\n```\n\nUse instead:\n```pyi\nfrom typing import Final, Literal\n\nx: Final = 42\ny: Final = 42\n```\n",
    "fix": 1
  },
  {
    "name": "bad-version-info-order",
    "code": "PYI066",
    "explanation": "## What it does\nChecks for code that branches on `sys.version_info` comparisons where\nbranches corresponding to older Python versions come before branches\ncorresponding to newer Python versions.\n\n## Why is this bad?\nAs a convention, branches that correspond to newer Python versions should\ncome first. This makes it easier to understand the desired behavior, which\ntypically corresponds to the latest Python versions.\n\nThis rule enforces the convention by checking for `if` tests that compare\n`sys.version_info` with `<` rather than `>=`.\n\nBy default, this rule only applies to stub files.\nIn [preview], it will also flag this anti-pattern in non-stub files.\n\n## Example\n\n```pyi\nimport sys\n\nif sys.version_info < (3, 10):\n    def read_data(x, *, preserve_order=True): ...\n\nelse:\n    def read_data(x): ...\n```\n\nUse instead:\n\n```pyi\nif sys.version_info >= (3, 10):\n    def read_data(x): ...\n\nelse:\n    def read_data(x, *, preserve_order=True): ...\n```\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "pytest-fixture-incorrect-parentheses-style",
    "code": "PT001",
    "explanation": "## What it does\nChecks for argument-free `@pytest.fixture()` decorators with or without\nparentheses, depending on the [`lint.flake8-pytest-style.fixture-parentheses`]\nsetting.\n\n## Why is this bad?\nIf a `@pytest.fixture()` doesn't take any arguments, the parentheses are\noptional.\n\nEither removing those unnecessary parentheses _or_ requiring them for all\nfixtures is fine, but it's best to be consistent. The rule defaults to\nremoving unnecessary parentheses, to match the documentation of the\nofficial pytest projects.\n\n## Example\n\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef my_fixture(): ...\n```\n\nUse instead:\n\n```python\nimport pytest\n\n\n@pytest.fixture\ndef my_fixture(): ...\n```\n\n## Options\n- `lint.flake8-pytest-style.fixture-parentheses`\n\n## References\n- [`pytest` documentation: API Reference: Fixtures](https://docs.pytest.org/en/latest/reference/reference.html#fixtures-api)\n",
    "fix": 2
  },
  {
    "name": "pytest-fixture-positional-args",
    "code": "PT002",
    "explanation": "## What it does\nChecks for `pytest.fixture` calls with positional arguments.\n\n## Why is this bad?\nFor clarity and consistency, prefer using keyword arguments to specify\nfixture configuration.\n\n## Example\n\n```python\nimport pytest\n\n\n@pytest.fixture(\"module\")\ndef my_fixture(): ...\n```\n\nUse instead:\n\n```python\nimport pytest\n\n\n@pytest.fixture(scope=\"module\")\ndef my_fixture(): ...\n```\n\n## References\n- [`pytest` documentation: `@pytest.fixture` functions](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fixture)\n"
  },
  {
    "name": "pytest-extraneous-scope-function",
    "code": "PT003",
    "explanation": "## What it does\nChecks for `pytest.fixture` calls with `scope=\"function\"`.\n\n## Why is this bad?\n`scope=\"function\"` can be omitted, as it is the default.\n\n## Example\n\n```python\nimport pytest\n\n\n@pytest.fixture(scope=\"function\")\ndef my_fixture(): ...\n```\n\nUse instead:\n\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef my_fixture(): ...\n```\n\n## References\n- [`pytest` documentation: `@pytest.fixture` functions](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fixture)\n",
    "fix": 2
  },
  {
    "name": "pytest-missing-fixture-name-underscore",
    "code": "PT004",
    "explanation": "## Removal\nThis rule has been removed because marking fixtures that do not return a value with an underscore\nisn't a practice recommended by the pytest community.\n\n## What it does\nChecks for `pytest` fixtures that do not return a value, but are not named\nwith a leading underscore.\n\n## Why is this bad?\nBy convention, fixtures that don't return a value should be named with a\nleading underscore, while fixtures that do return a value should not.\n\nThis rule ignores abstract fixtures and generators.\n\n## Example\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef patch_something(mocker):\n    mocker.patch(\"module.object\")\n\n\n@pytest.fixture()\ndef use_context():\n    with create_context():\n        yield\n```\n\nUse instead:\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef _patch_something(mocker):\n    mocker.patch(\"module.object\")\n\n\n@pytest.fixture()\ndef _use_context():\n    with create_context():\n        yield\n```\n\n## References\n- [`pytest` documentation: `@pytest.fixture` functions](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fixture)\n"
  },
  {
    "name": "pytest-incorrect-fixture-name-underscore",
    "code": "PT005",
    "explanation": "## Removal\nThis rule has been removed because marking fixtures that do not return a value with an underscore\nisn't a practice recommended by the pytest community.\n\n## What it does\nChecks for `pytest` fixtures that return a value, but are named with a\nleading underscore.\n\n## Why is this bad?\nBy convention, fixtures that don't return a value should be named with a\nleading underscore, while fixtures that do return a value should not.\n\nThis rule ignores abstract fixtures.\n\n## Example\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef _some_object():\n    return SomeClass()\n\n\n@pytest.fixture()\ndef _some_object_with_cleanup():\n    obj = SomeClass()\n    yield obj\n    obj.cleanup()\n```\n\nUse instead:\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef some_object():\n    return SomeClass()\n\n\n@pytest.fixture()\ndef some_object_with_cleanup():\n    obj = SomeClass()\n    yield obj\n    obj.cleanup()\n```\n\n## References\n- [`pytest` documentation: `@pytest.fixture` functions](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fixture)\n"
  },
  {
    "name": "pytest-parametrize-names-wrong-type",
    "code": "PT006",
    "explanation": "## What it does\nChecks for the type of parameter names passed to `pytest.mark.parametrize`.\n\n## Why is this bad?\nThe `argnames` argument of `pytest.mark.parametrize` takes a string or\na sequence of strings. For a single parameter, it's preferable to use a\nstring. For multiple parameters, it's preferable to use the style\nconfigured via the [`lint.flake8-pytest-style.parametrize-names-type`] setting.\n\n## Example\n\n```python\nimport pytest\n\n\n# single parameter, always expecting string\n@pytest.mark.parametrize((\"param\",), [1, 2, 3])\ndef test_foo(param): ...\n\n\n# multiple parameters, expecting tuple\n@pytest.mark.parametrize([\"param1\", \"param2\"], [(1, 2), (3, 4)])\ndef test_bar(param1, param2): ...\n\n\n# multiple parameters, expecting tuple\n@pytest.mark.parametrize(\"param1,param2\", [(1, 2), (3, 4)])\ndef test_baz(param1, param2): ...\n```\n\nUse instead:\n\n```python\nimport pytest\n\n\n@pytest.mark.parametrize(\"param\", [1, 2, 3])\ndef test_foo(param): ...\n\n\n@pytest.mark.parametrize((\"param1\", \"param2\"), [(1, 2), (3, 4)])\ndef test_bar(param1, param2): ...\n```\n\n## Options\n- `lint.flake8-pytest-style.parametrize-names-type`\n\n## References\n- [`pytest` documentation: How to parametrize fixtures and test functions](https://docs.pytest.org/en/latest/how-to/parametrize.html#pytest-mark-parametrize)\n",
    "fix": 1
  },
  {
    "name": "pytest-parametrize-values-wrong-type",
    "code": "PT007",
    "explanation": "## What it does\nChecks for the type of parameter values passed to `pytest.mark.parametrize`.\n\n## Why is this bad?\nThe `argvalues` argument of `pytest.mark.parametrize` takes an iterator of\nparameter values, which can be provided as lists or tuples.\n\nTo aid in readability, it's recommended to use a consistent style for the\nlist of values rows, and, in the case of multiple parameters, for each row\nof values.\n\nThe style for the list of values rows can be configured via the\n[`lint.flake8-pytest-style.parametrize-values-type`] setting, while the\nstyle for each row of values can be configured via the\n[`lint.flake8-pytest-style.parametrize-values-row-type`] setting.\n\nFor example, [`lint.flake8-pytest-style.parametrize-values-type`] will lead to\nthe following expectations:\n\n- `tuple`: `@pytest.mark.parametrize(\"value\", (\"a\", \"b\", \"c\"))`\n- `list`: `@pytest.mark.parametrize(\"value\", [\"a\", \"b\", \"c\"])`\n\nSimilarly, [`lint.flake8-pytest-style.parametrize-values-row-type`] will lead to\nthe following expectations:\n\n- `tuple`: `@pytest.mark.parametrize((\"key\", \"value\"), [(\"a\", \"b\"), (\"c\", \"d\")])`\n- `list`: `@pytest.mark.parametrize((\"key\", \"value\"), [[\"a\", \"b\"], [\"c\", \"d\"]])`\n\n## Example\n\n```python\nimport pytest\n\n\n# expected list, got tuple\n@pytest.mark.parametrize(\"param\", (1, 2))\ndef test_foo(param): ...\n\n\n# expected top-level list, got tuple\n@pytest.mark.parametrize(\n    (\"param1\", \"param2\"),\n    (\n        (1, 2),\n        (3, 4),\n    ),\n)\ndef test_bar(param1, param2): ...\n\n\n# expected individual rows to be tuples, got lists\n@pytest.mark.parametrize(\n    (\"param1\", \"param2\"),\n    [\n        [1, 2],\n        [3, 4],\n    ],\n)\ndef test_baz(param1, param2): ...\n```\n\nUse instead:\n\n```python\nimport pytest\n\n\n@pytest.mark.parametrize(\"param\", [1, 2, 3])\ndef test_foo(param): ...\n\n\n@pytest.mark.parametrize((\"param1\", \"param2\"), [(1, 2), (3, 4)])\ndef test_bar(param1, param2): ...\n```\n\n## Options\n- `lint.flake8-pytest-style.parametrize-values-type`\n- `lint.flake8-pytest-style.parametrize-values-row-type`\n\n## References\n- [`pytest` documentation: How to parametrize fixtures and test functions](https://docs.pytest.org/en/latest/how-to/parametrize.html#pytest-mark-parametrize)\n",
    "fix": 1
  },
  {
    "name": "pytest-patch-with-lambda",
    "code": "PT008",
    "explanation": "## What it does\nChecks for mocked calls that use a dummy `lambda` function instead of\n`return_value`.\n\n## Why is this bad?\nWhen patching calls, an explicit `return_value` better conveys the intent\nthan a `lambda` function, assuming the `lambda` does not use the arguments\npassed to it.\n\n`return_value` is also robust to changes in the patched function's\nsignature, and enables additional assertions to verify behavior. For\nexample, `return_value` allows for verification of the number of calls or\nthe arguments passed to the patched function via `assert_called_once_with`\nand related methods.\n\n## Example\n```python\ndef test_foo(mocker):\n    mocker.patch(\"module.target\", lambda x, y: 7)\n```\n\nUse instead:\n```python\ndef test_foo(mocker):\n    mocker.patch(\"module.target\", return_value=7)\n\n    # If the lambda makes use of the arguments, no diagnostic is emitted.\n    mocker.patch(\"module.other_target\", lambda x, y: x)\n```\n\n## References\n- [Python documentation: `unittest.mock.patch`](https://docs.python.org/3/library/unittest.mock.html#unittest.mock.patch)\n- [PyPI: `pytest-mock`](https://pypi.org/project/pytest-mock/)\n"
  },
  {
    "name": "pytest-unittest-assertion",
    "code": "PT009",
    "explanation": "## What it does\nChecks for uses of assertion methods from the `unittest` module.\n\n## Why is this bad?\nTo make use of `pytest`'s assertion rewriting, a regular `assert` statement\nis preferred over `unittest`'s assertion methods.\n\n## Example\n```python\nimport unittest\n\n\nclass TestFoo(unittest.TestCase):\n    def test_foo(self):\n        self.assertEqual(a, b)\n```\n\nUse instead:\n```python\nimport unittest\n\n\nclass TestFoo(unittest.TestCase):\n    def test_foo(self):\n        assert a == b\n```\n\n## References\n- [`pytest` documentation: Assertion introspection details](https://docs.pytest.org/en/7.1.x/how-to/assert.html#assertion-introspection-details)\n",
    "fix": 1
  },
  {
    "name": "pytest-raises-without-exception",
    "code": "PT010",
    "explanation": "## What it does\nChecks for `pytest.raises` calls without an expected exception.\n\n## Why is this bad?\n`pytest.raises` expects to receive an expected exception as its first\nargument. If omitted, the `pytest.raises` call will fail at runtime.\n\n## Example\n```python\nimport pytest\n\n\ndef test_foo():\n    with pytest.raises():\n        do_something()\n```\n\nUse instead:\n```python\nimport pytest\n\n\ndef test_foo():\n    with pytest.raises(SomeException):\n        do_something()\n```\n\n## References\n- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)\n"
  },
  {
    "name": "pytest-raises-too-broad",
    "code": "PT011",
    "explanation": "## What it does\nChecks for `pytest.raises` calls without a `match` parameter.\n\n## Why is this bad?\n`pytest.raises(Error)` will catch any `Error` and may catch errors that are\nunrelated to the code under test. To avoid this, `pytest.raises` should be\ncalled with a `match` parameter. The exception names that require a `match`\nparameter can be configured via the\n[`lint.flake8-pytest-style.raises-require-match-for`] and\n[`lint.flake8-pytest-style.raises-extend-require-match-for`] settings.\n\n## Example\n```python\nimport pytest\n\n\ndef test_foo():\n    with pytest.raises(ValueError):\n        ...\n\n    # empty string is also an error\n    with pytest.raises(ValueError, match=\"\"):\n        ...\n```\n\nUse instead:\n```python\nimport pytest\n\n\ndef test_foo():\n    with pytest.raises(ValueError, match=\"expected message\"):\n        ...\n```\n\n## Options\n- `lint.flake8-pytest-style.raises-require-match-for`\n- `lint.flake8-pytest-style.raises-extend-require-match-for`\n\n## References\n- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)\n"
  },
  {
    "name": "pytest-raises-with-multiple-statements",
    "code": "PT012",
    "explanation": "## What it does\nChecks for `pytest.raises` context managers with multiple statements.\n\nThis rule allows `pytest.raises` bodies to contain `for`\nloops with empty bodies (e.g., `pass` or `...` statements), to test\niterator behavior.\n\n## Why is this bad?\nWhen a `pytest.raises` is used as a context manager and contains multiple\nstatements, it can lead to the test passing when it actually should fail.\n\nA `pytest.raises` context manager should only contain a single simple\nstatement that raises the expected exception.\n\n## Example\n```python\nimport pytest\n\n\ndef test_foo():\n    with pytest.raises(MyError):\n        setup()\n        func_to_test()  # not executed if `setup()` raises `MyError`\n        assert foo()  # not executed\n```\n\nUse instead:\n```python\nimport pytest\n\n\ndef test_foo():\n    setup()\n    with pytest.raises(MyError):\n        func_to_test()\n    assert foo()\n```\n\n## References\n- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)\n"
  },
  {
    "name": "pytest-incorrect-pytest-import",
    "code": "PT013",
    "explanation": "## What it does\nChecks for incorrect import of pytest.\n\n## Why is this bad?\nFor consistency, `pytest` should be imported as `import pytest` and its members should be\naccessed in the form of `pytest.xxx.yyy` for consistency\n\n## Example\n```python\nimport pytest as pt\nfrom pytest import fixture\n```\n\nUse instead:\n```python\nimport pytest\n```\n"
  },
  {
    "name": "pytest-duplicate-parametrize-test-cases",
    "code": "PT014",
    "explanation": "## What it does\nChecks for duplicate test cases in `pytest.mark.parametrize`.\n\n## Why is this bad?\nDuplicate test cases are redundant and should be removed.\n\n## Example\n\n```python\nimport pytest\n\n\n@pytest.mark.parametrize(\n    (\"param1\", \"param2\"),\n    [\n        (1, 2),\n        (1, 2),\n    ],\n)\ndef test_foo(param1, param2): ...\n```\n\nUse instead:\n\n```python\nimport pytest\n\n\n@pytest.mark.parametrize(\n    (\"param1\", \"param2\"),\n    [\n        (1, 2),\n    ],\n)\ndef test_foo(param1, param2): ...\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as tests that rely on mutable global\nstate may be affected by removing duplicate test cases.\n\n## References\n- [`pytest` documentation: How to parametrize fixtures and test functions](https://docs.pytest.org/en/latest/how-to/parametrize.html#pytest-mark-parametrize)\n",
    "fix": 1
  },
  {
    "name": "pytest-assert-always-false",
    "code": "PT015",
    "explanation": "## What it does\nChecks for `assert` statements whose test expression is a falsy value.\n\n## Why is this bad?\n`pytest.fail` conveys the intent more clearly than `assert falsy_value`.\n\n## Example\n```python\ndef test_foo():\n    if some_condition:\n        assert False, \"some_condition was True\"\n```\n\nUse instead:\n```python\nimport pytest\n\n\ndef test_foo():\n    if some_condition:\n        pytest.fail(\"some_condition was True\")\n    ...\n```\n\n## References\n- [`pytest` documentation: `pytest.fail`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fail)\n"
  },
  {
    "name": "pytest-fail-without-message",
    "code": "PT016",
    "explanation": "## What it does\nChecks for `pytest.fail` calls without a message.\n\n## Why is this bad?\n`pytest.fail` calls without a message make it harder to understand and debug test failures.\n\n## Example\n```python\nimport pytest\n\n\ndef test_foo():\n    pytest.fail()\n\n\ndef test_bar():\n    pytest.fail(\"\")\n\n\ndef test_baz():\n    pytest.fail(reason=\"\")\n```\n\nUse instead:\n```python\nimport pytest\n\n\ndef test_foo():\n    pytest.fail(\"...\")\n\n\ndef test_bar():\n    pytest.fail(reason=\"...\")\n```\n\n## References\n- [`pytest` documentation: `pytest.fail`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-fail)\n"
  },
  {
    "name": "pytest-assert-in-except",
    "code": "PT017",
    "explanation": "## What it does\nChecks for `assert` statements in `except` clauses.\n\n## Why is this bad?\nWhen testing for exceptions, `pytest.raises()` should be used instead of\n`assert` statements in `except` clauses, as it's more explicit and\nidiomatic. Further, `pytest.raises()` will fail if the exception is _not_\nraised, unlike the `assert` statement.\n\n## Example\n```python\ndef test_foo():\n    try:\n        1 / 0\n    except ZeroDivisionError as e:\n        assert e.args\n```\n\nUse instead:\n```python\nimport pytest\n\n\ndef test_foo():\n    with pytest.raises(ZeroDivisionError) as exc_info:\n        1 / 0\n    assert exc_info.value.args\n```\n\n## References\n- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)\n"
  },
  {
    "name": "pytest-composite-assertion",
    "code": "PT018",
    "explanation": "## What it does\nChecks for assertions that combine multiple independent conditions.\n\n## Why is this bad?\nComposite assertion statements are harder to debug upon failure, as the\nfailure message will not indicate which condition failed.\n\n## Example\n```python\ndef test_foo():\n    assert something and something_else\n\n\ndef test_bar():\n    assert not (something or something_else)\n```\n\nUse instead:\n```python\ndef test_foo():\n    assert something\n    assert something_else\n\n\ndef test_bar():\n    assert not something\n    assert not something_else\n```\n",
    "fix": 1
  },
  {
    "name": "pytest-fixture-param-without-value",
    "code": "PT019",
    "explanation": "## What it does\nChecks for `pytest` test functions that should be decorated with\n`@pytest.mark.usefixtures`.\n\n## Why is this bad?\nIn `pytest`, fixture injection is used to activate fixtures in a test\nfunction.\n\nFixtures can be injected either by passing them as parameters to the test\nfunction, or by using the `@pytest.mark.usefixtures` decorator.\n\nIf the test function depends on the fixture being activated, but does not\nuse it in the test body or otherwise rely on its return value, prefer\nthe `@pytest.mark.usefixtures` decorator, to make the dependency explicit\nand avoid the confusion caused by unused arguments.\n\n## Example\n\n```python\nimport pytest\n\n\n@pytest.fixture\ndef _patch_something(): ...\n\n\ndef test_foo(_patch_something): ...\n```\n\nUse instead:\n\n```python\nimport pytest\n\n\n@pytest.fixture\ndef _patch_something(): ...\n\n\n@pytest.mark.usefixtures(\"_patch_something\")\ndef test_foo(): ...\n```\n\n## References\n- [`pytest` documentation: `pytest.mark.usefixtures`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-mark-usefixtures)\n"
  },
  {
    "name": "pytest-deprecated-yield-fixture",
    "code": "PT020",
    "explanation": "## What it does\nChecks for `pytest.yield_fixture` usage.\n\n## Why is this bad?\n`pytest.yield_fixture` is deprecated. `pytest.fixture` should be used instead.\n\n## Example\n```python\nimport pytest\n\n\n@pytest.yield_fixture()\ndef my_fixture():\n    obj = SomeClass()\n    yield obj\n    obj.cleanup()\n```\n\nUse instead:\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef my_fixture():\n    obj = SomeClass()\n    yield obj\n    obj.cleanup()\n```\n\n## References\n- [`pytest` documentation: `yield_fixture` functions](https://docs.pytest.org/en/latest/yieldfixture.html)\n"
  },
  {
    "name": "pytest-fixture-finalizer-callback",
    "code": "PT021",
    "explanation": "## What it does\nChecks for unnecessary `request.addfinalizer` usages in `pytest` fixtures.\n\n## Why is this bad?\n`pytest` offers two ways to perform cleanup in fixture code. The first is\nsequential (via the `yield` statement), the second callback-based (via\n`request.addfinalizer`).\n\nThe sequential approach is more readable and should be preferred, unless\nthe fixture uses the \"factory as fixture\" pattern.\n\n## Example\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef my_fixture(request):\n    resource = acquire_resource()\n    request.addfinalizer(resource.release)\n    return resource\n```\n\nUse instead:\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef my_fixture():\n    resource = acquire_resource()\n    yield resource\n    resource.release()\n\n\n# \"factory-as-fixture\" pattern\n@pytest.fixture()\ndef my_factory(request):\n    def create_resource(arg):\n        resource = acquire_resource(arg)\n        request.addfinalizer(resource.release)\n        return resource\n\n    return create_resource\n```\n\n## References\n- [`pytest` documentation: Adding finalizers directly](https://docs.pytest.org/en/latest/how-to/fixtures.html#adding-finalizers-directly)\n- [`pytest` documentation: Factories as fixtures](https://docs.pytest.org/en/latest/how-to/fixtures.html#factories-as-fixtures)\n"
  },
  {
    "name": "pytest-useless-yield-fixture",
    "code": "PT022",
    "explanation": "## What it does\nChecks for unnecessary `yield` expressions in `pytest` fixtures.\n\n## Why is this bad?\nIn `pytest` fixtures, the `yield` expression should only be used for fixtures\nthat include teardown code, to clean up the fixture after the test function\nhas finished executing.\n\n## Example\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef my_fixture():\n    resource = acquire_resource()\n    yield resource\n```\n\nUse instead:\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef my_fixture_with_teardown():\n    resource = acquire_resource()\n    yield resource\n    resource.release()\n\n\n@pytest.fixture()\ndef my_fixture_without_teardown():\n    resource = acquire_resource()\n    return resource\n```\n\n## References\n- [`pytest` documentation: Teardown/Cleanup](https://docs.pytest.org/en/latest/how-to/fixtures.html#teardown-cleanup-aka-fixture-finalization)\n",
    "fix": 2
  },
  {
    "name": "pytest-incorrect-mark-parentheses-style",
    "code": "PT023",
    "explanation": "## What it does\nChecks for argument-free `@pytest.mark.<marker>()` decorators with or\nwithout parentheses, depending on the [`lint.flake8-pytest-style.mark-parentheses`]\nsetting.\n\nThe rule defaults to removing unnecessary parentheses,\nto match the documentation of the official pytest projects.\n\n## Why is this bad?\nIf a `@pytest.mark.<marker>()` doesn't take any arguments, the parentheses are\noptional.\n\nEither removing those unnecessary parentheses _or_ requiring them for all\nfixtures is fine, but it's best to be consistent.\n\n## Example\n\n```python\nimport pytest\n\n\n@pytest.mark.foo\ndef test_something(): ...\n```\n\nUse instead:\n\n```python\nimport pytest\n\n\n@pytest.mark.foo()\ndef test_something(): ...\n```\n\n## Options\n- `lint.flake8-pytest-style.mark-parentheses`\n\n## References\n- [`pytest` documentation: Marks](https://docs.pytest.org/en/latest/reference/reference.html#marks)\n",
    "fix": 2
  },
  {
    "name": "pytest-unnecessary-asyncio-mark-on-fixture",
    "code": "PT024",
    "explanation": "## What it does\nChecks for unnecessary `@pytest.mark.asyncio` decorators applied to fixtures.\n\n## Why is this bad?\n`pytest.mark.asyncio` is unnecessary for fixtures.\n\n## Example\n```python\nimport pytest\n\n\n@pytest.mark.asyncio()\n@pytest.fixture()\nasync def my_fixture():\n    return 0\n```\n\nUse instead:\n```python\nimport pytest\n\n\n@pytest.fixture()\nasync def my_fixture():\n    return 0\n```\n\n## References\n- [PyPI: `pytest-asyncio`](https://pypi.org/project/pytest-asyncio/)\n",
    "fix": 2
  },
  {
    "name": "pytest-erroneous-use-fixtures-on-fixture",
    "code": "PT025",
    "explanation": "## What it does\nChecks for `pytest.mark.usefixtures` decorators applied to `pytest`\nfixtures.\n\n## Why is this bad?\nThe `pytest.mark.usefixtures` decorator has no effect on `pytest` fixtures.\n\n## Example\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef a():\n    pass\n\n\n@pytest.mark.usefixtures(\"a\")\n@pytest.fixture()\ndef b(a):\n    pass\n```\n\nUse instead:\n```python\nimport pytest\n\n\n@pytest.fixture()\ndef a():\n    pass\n\n\n@pytest.fixture()\ndef b(a):\n    pass\n```\n\n## References\n- [`pytest` documentation: `pytest.mark.usefixtures`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-mark-usefixtures)\n",
    "fix": 2
  },
  {
    "name": "pytest-use-fixtures-without-parameters",
    "code": "PT026",
    "explanation": "## What it does\nChecks for `@pytest.mark.usefixtures()` decorators that aren't passed any\narguments.\n\n## Why is this bad?\nA `@pytest.mark.usefixtures()` decorator that isn't passed any arguments is\nuseless and should be removed.\n\n## Example\n\n```python\nimport pytest\n\n\n@pytest.mark.usefixtures()\ndef test_something(): ...\n```\n\nUse instead:\n\n```python\ndef test_something(): ...\n```\n\n## References\n- [`pytest` documentation: `pytest.mark.usefixtures`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-mark-usefixtures)\n",
    "fix": 2
  },
  {
    "name": "pytest-unittest-raises-assertion",
    "code": "PT027",
    "explanation": "## What it does\nChecks for uses of exception-related assertion methods from the `unittest`\nmodule.\n\n## Why is this bad?\nTo enforce the assertion style recommended by `pytest`, `pytest.raises` is\npreferred over the exception-related assertion methods in `unittest`, like\n`assertRaises`.\n\n## Example\n```python\nimport unittest\n\n\nclass TestFoo(unittest.TestCase):\n    def test_foo(self):\n        with self.assertRaises(ValueError):\n            raise ValueError(\"foo\")\n```\n\nUse instead:\n```python\nimport unittest\nimport pytest\n\n\nclass TestFoo(unittest.TestCase):\n    def test_foo(self):\n        with pytest.raises(ValueError):\n            raise ValueError(\"foo\")\n```\n\n## References\n- [`pytest` documentation: Assertions about expected exceptions](https://docs.pytest.org/en/latest/how-to/assert.html#assertions-about-expected-exceptions)\n",
    "fix": 1
  },
  {
    "name": "pytest-parameter-with-default-argument",
    "code": "PT028",
    "explanation": "## What it does\nChecks for parameters of test functions with default arguments.\n\n## Why is this bad?\nSuch a parameter will always have the default value during the test\nregardless of whether a fixture with the same name is defined.\n\n## Example\n\n```python\ndef test_foo(a=1): ...\n```\n\nUse instead:\n\n```python\ndef test_foo(a): ...\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as modifying a function signature can\nchange the behavior of the code.\n\n## References\n- [Original Pytest issue](https://github.com/pytest-dev/pytest/issues/12693)\n",
    "preview": true
  },
  {
    "name": "pytest-warns-without-warning",
    "code": "PT029",
    "explanation": "## What it does\nChecks for `pytest.warns` calls without an expected warning.\n\n## Why is this bad?\n`pytest.warns` expects to receive an expected warning as its first\nargument. If omitted, the `pytest.warns` call will fail at runtime.\n\n## Example\n```python\nimport pytest\n\n\ndef test_foo():\n    with pytest.warns():\n        do_something()\n```\n\nUse instead:\n```python\nimport pytest\n\n\ndef test_foo():\n    with pytest.warns(SomeWarning):\n        do_something()\n```\n\n## References\n- [`pytest` documentation: `pytest.warns`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-warns)\n",
    "preview": true
  },
  {
    "name": "pytest-warns-too-broad",
    "code": "PT030",
    "explanation": "## What it does\nChecks for `pytest.warns` calls without a `match` parameter.\n\n## Why is this bad?\n`pytest.warns(Warning)` will catch any `Warning` and may catch warnings that\nare unrelated to the code under test. To avoid this, `pytest.warns` should\nbe called with a `match` parameter. The warning names that require a `match`\nparameter can be configured via the\n[`lint.flake8-pytest-style.warns-require-match-for`] and\n[`lint.flake8-pytest-style.warns-extend-require-match-for`] settings.\n\n## Example\n```python\nimport pytest\n\n\ndef test_foo():\n    with pytest.warns(RuntimeWarning):\n        ...\n\n    # empty string is also an error\n    with pytest.warns(RuntimeWarning, match=\"\"):\n        ...\n```\n\nUse instead:\n```python\nimport pytest\n\n\ndef test_foo():\n    with pytest.warns(RuntimeWarning, match=\"expected message\"):\n        ...\n```\n\n## Options\n- `lint.flake8-pytest-style.warns-require-match-for`\n- `lint.flake8-pytest-style.warns-extend-require-match-for`\n\n## References\n- [`pytest` documentation: `pytest.warns`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-warns)\n",
    "preview": true
  },
  {
    "name": "pytest-warns-with-multiple-statements",
    "code": "PT031",
    "explanation": "## What it does\nChecks for `pytest.warns` context managers with multiple statements.\n\nThis rule allows `pytest.warns` bodies to contain `for`\nloops with empty bodies (e.g., `pass` or `...` statements), to test\niterator behavior.\n\n## Why is this bad?\nWhen `pytest.warns` is used as a context manager and contains multiple\nstatements, it can lead to the test passing when it should instead fail.\n\nA `pytest.warns` context manager should only contain a single\nsimple statement that triggers the expected warning.\n\n\n## Example\n```python\nimport pytest\n\n\ndef test_foo_warns():\n    with pytest.warns(Warning):\n        setup()  # False negative if setup triggers a warning but foo does not.\n        foo()\n```\n\nUse instead:\n```python\nimport pytest\n\n\ndef test_foo_warns():\n    setup()\n    with pytest.warns(Warning):\n        foo()\n```\n\n## References\n- [`pytest` documentation: `pytest.warns`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-warns)\n",
    "preview": true
  },
  {
    "name": "bad-quotes-inline-string",
    "code": "Q000",
    "explanation": "## What it does\nChecks for inline strings that use single quotes or double quotes,\ndepending on the value of the [`lint.flake8-quotes.inline-quotes`] option.\n\n## Why is this bad?\nConsistency is good. Use either single or double quotes for inline\nstrings, but be consistent.\n\n## Example\n```python\nfoo = 'bar'\n```\n\nAssuming `inline-quotes` is set to `double`, use instead:\n```python\nfoo = \"bar\"\n```\n\n## Options\n- `lint.flake8-quotes.inline-quotes`\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent quotes for inline strings, making the rule\nredundant.\n\n[formatter]: https://docs.astral.sh/ruff/formatter\n",
    "fix": 1
  },
  {
    "name": "bad-quotes-multiline-string",
    "code": "Q001",
    "explanation": "## What it does\nChecks for multiline strings that use single quotes or double quotes,\ndepending on the value of the [`lint.flake8-quotes.multiline-quotes`]\nsetting.\n\n## Why is this bad?\nConsistency is good. Use either single or double quotes for multiline\nstrings, but be consistent.\n\n## Example\n```python\nfoo = '''\nbar\n'''\n```\n\nAssuming `multiline-quotes` is set to `double`, use instead:\n```python\nfoo = \"\"\"\nbar\n\"\"\"\n```\n\n## Options\n- `lint.flake8-quotes.multiline-quotes`\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces double quotes for multiline strings, making the rule\nredundant.\n\n[formatter]: https://docs.astral.sh/ruff/formatter\n",
    "fix": 2
  },
  {
    "name": "bad-quotes-docstring",
    "code": "Q002",
    "explanation": "## What it does\nChecks for docstrings that use single quotes or double quotes, depending\non the value of the [`lint.flake8-quotes.docstring-quotes`] setting.\n\n## Why is this bad?\nConsistency is good. Use either single or double quotes for docstring\nstrings, but be consistent.\n\n## Example\n```python\n'''\nbar\n'''\n```\n\nAssuming `docstring-quotes` is set to `double`, use instead:\n```python\n\"\"\"\nbar\n\"\"\"\n```\n\n## Options\n- `lint.flake8-quotes.docstring-quotes`\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces double quotes for docstrings, making the rule\nredundant.\n\n[formatter]: https://docs.astral.sh/ruff/formatter\n",
    "fix": 1
  },
  {
    "name": "avoidable-escaped-quote",
    "code": "Q003",
    "explanation": "## What it does\nChecks for strings that include escaped quotes, and suggests changing\nthe quote style to avoid the need to escape them.\n\n## Why is this bad?\nIt's preferable to avoid escaped quotes in strings. By changing the\nouter quote style, you can avoid escaping inner quotes.\n\n## Example\n```python\nfoo = 'bar\\'s'\n```\n\nUse instead:\n```python\nfoo = \"bar's\"\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter automatically removes unnecessary escapes, making the rule\nredundant.\n\n[formatter]: https://docs.astral.sh/ruff/formatter\n",
    "fix": 2
  },
  {
    "name": "unnecessary-escaped-quote",
    "code": "Q004",
    "explanation": "## What it does\nChecks for strings that include unnecessarily escaped quotes.\n\n## Why is this bad?\nIf a string contains an escaped quote that doesn't match the quote\ncharacter used for the string, it's unnecessary and can be removed.\n\n## Example\n```python\nfoo = \"bar\\'s\"\n```\n\nUse instead:\n```python\nfoo = \"bar's\"\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter automatically removes unnecessary escapes, making the rule\nredundant.\n\n[formatter]: https://docs.astral.sh/ruff/formatter\n",
    "fix": 2
  },
  {
    "name": "unnecessary-paren-on-raise-exception",
    "code": "RSE102",
    "explanation": "## What it does\nChecks for unnecessary parentheses on raised exceptions.\n\n## Why is this bad?\nIf an exception is raised without any arguments, parentheses are not\nrequired, as the `raise` statement accepts either an exception instance\nor an exception class (which is then implicitly instantiated).\n\nRemoving the parentheses makes the code more concise.\n\n## Known problems\nParentheses can only be omitted if the exception is a class, as opposed to\na function call. This rule isn't always capable of distinguishing between\nthe two.\n\nFor example, if you import a function `module.get_exception` from another\nmodule, and `module.get_exception` returns an exception object, this rule will\nincorrectly mark the parentheses in `raise module.get_exception()` as\nunnecessary.\n\n## Example\n```python\nraise TypeError()\n```\n\nUse instead:\n```python\nraise TypeError\n```\n\n## References\n- [Python documentation: The `raise` statement](https://docs.python.org/3/reference/simple_stmts.html#the-raise-statement)\n",
    "fix": 2
  },
  {
    "name": "unnecessary-return-none",
    "code": "RET501",
    "explanation": "## What it does\nChecks for the presence of a `return None` statement when `None` is the only\npossible return value.\n\n## Why is this bad?\nPython implicitly assumes `return None` if an explicit `return` value is\nomitted. Therefore, explicitly returning `None` is redundant and should be\navoided when it is the only possible `return` value across all code paths\nin a given function.\n\n## Example\n```python\ndef foo(bar):\n    if not bar:\n        return\n    return None\n```\n\nUse instead:\n```python\ndef foo(bar):\n    if not bar:\n        return\n    return\n```\n",
    "fix": 2
  },
  {
    "name": "implicit-return-value",
    "code": "RET502",
    "explanation": "## What it does\nChecks for the presence of a `return` statement with no explicit value,\nfor functions that return non-`None` values elsewhere.\n\n## Why is this bad?\nIncluding a `return` statement with no explicit value can cause confusion\nwhen other `return` statements in the function return non-`None` values.\nPython implicitly assumes return `None` if no other return value is present.\nAdding an explicit `return None` can make the code more readable by clarifying\nintent.\n\n## Example\n```python\ndef foo(bar):\n    if not bar:\n        return\n    return 1\n```\n\nUse instead:\n```python\ndef foo(bar):\n    if not bar:\n        return None\n    return 1\n```\n",
    "fix": 2
  },
  {
    "name": "implicit-return",
    "code": "RET503",
    "explanation": "## What it does\nChecks for missing explicit `return` statements at the end of functions\nthat can return non-`None` values.\n\n## Why is this bad?\nThe lack of an explicit `return` statement at the end of a function that\ncan return non-`None` values can cause confusion. Python implicitly returns\n`None` if no other return value is present. Adding an explicit\n`return None` can make the code more readable by clarifying intent.\n\n## Example\n```python\ndef foo(bar):\n    if not bar:\n        return 1\n```\n\nUse instead:\n```python\ndef foo(bar):\n    if not bar:\n        return 1\n    return None\n```\n",
    "fix": 2
  },
  {
    "name": "unnecessary-assign",
    "code": "RET504",
    "explanation": "## What it does\nChecks for variable assignments that immediately precede a `return` of the\nassigned variable.\n\n## Why is this bad?\nThe variable assignment is not necessary, as the value can be returned\ndirectly.\n\n## Example\n```python\ndef foo():\n    bar = 1\n    return bar\n```\n\nUse instead:\n```python\ndef foo():\n    return 1\n```\n",
    "fix": 2
  },
  {
    "name": "superfluous-else-return",
    "code": "RET505",
    "explanation": "## What it does\nChecks for `else` statements with a `return` statement in the preceding\n`if` block.\n\n## Why is this bad?\nThe `else` statement is not needed as the `return` statement will always\nbreak out of the enclosing function. Removing the `else` will reduce\nnesting and make the code more readable.\n\n## Example\n```python\ndef foo(bar, baz):\n    if bar:\n        return 1\n    else:\n        return baz\n```\n\nUse instead:\n```python\ndef foo(bar, baz):\n    if bar:\n        return 1\n    return baz\n```\n",
    "fix": 1
  },
  {
    "name": "superfluous-else-raise",
    "code": "RET506",
    "explanation": "## What it does\nChecks for `else` statements with a `raise` statement in the preceding `if`\nblock.\n\n## Why is this bad?\nThe `else` statement is not needed as the `raise` statement will always\nbreak out of the current scope. Removing the `else` will reduce nesting\nand make the code more readable.\n\n## Example\n```python\ndef foo(bar, baz):\n    if bar == \"Specific Error\":\n        raise Exception(bar)\n    else:\n        raise Exception(baz)\n```\n\nUse instead:\n```python\ndef foo(bar, baz):\n    if bar == \"Specific Error\":\n        raise Exception(bar)\n    raise Exception(baz)\n```\n",
    "fix": 1
  },
  {
    "name": "superfluous-else-continue",
    "code": "RET507",
    "explanation": "## What it does\nChecks for `else` statements with a `continue` statement in the preceding\n`if` block.\n\n## Why is this bad?\nThe `else` statement is not needed, as the `continue` statement will always\ncontinue onto the next iteration of a loop. Removing the `else` will reduce\nnesting and make the code more readable.\n\n## Example\n```python\ndef foo(bar, baz):\n    for i in bar:\n        if i < baz:\n            continue\n        else:\n            x = 0\n```\n\nUse instead:\n```python\ndef foo(bar, baz):\n    for i in bar:\n        if i < baz:\n            continue\n        x = 0\n```\n",
    "fix": 1
  },
  {
    "name": "superfluous-else-break",
    "code": "RET508",
    "explanation": "## What it does\nChecks for `else` statements with a `break` statement in the preceding `if`\nblock.\n\n## Why is this bad?\nThe `else` statement is not needed, as the `break` statement will always\nbreak out of the loop. Removing the `else` will reduce nesting and make the\ncode more readable.\n\n## Example\n```python\ndef foo(bar, baz):\n    for i in bar:\n        if i > baz:\n            break\n        else:\n            x = 0\n```\n\nUse instead:\n```python\ndef foo(bar, baz):\n    for i in bar:\n        if i > baz:\n            break\n        x = 0\n```\n",
    "fix": 1
  },
  {
    "name": "private-member-access",
    "code": "SLF001",
    "explanation": "## What it does\nChecks for accesses on \"private\" class members.\n\n## Why is this bad?\nIn Python, the convention is such that class members that are prefixed\nwith a single underscore, or prefixed but not suffixed with a double\nunderscore, are considered private and intended for internal use.\n\nUsing such \"private\" members is considered a misuse of the class, as\nthere are no guarantees that the member will be present in future\nversions, that it will have the same type, or that it will have the same\nbehavior. Instead, use the class's public interface.\n\nThis rule ignores accesses on dunder methods (e.g., `__init__`) and sunder\nmethods (e.g., `_missing_`).\n\n## Example\n```python\nclass Class:\n    def __init__(self):\n        self._private_member = \"...\"\n\n\nvar = Class()\nprint(var._private_member)\n```\n\nUse instead:\n```python\nclass Class:\n    def __init__(self):\n        self.public_member = \"...\"\n\n\nvar = Class()\nprint(var.public_member)\n```\n\n## Options\n- `lint.flake8-self.ignore-names`\n\n## References\n- [_What is the meaning of single or double underscores before an object name?_](https://stackoverflow.com/questions/1301346/what-is-the-meaning-of-single-and-double-underscore-before-an-object-name)\n"
  },
  {
    "name": "duplicate-isinstance-call",
    "code": "SIM101",
    "explanation": "## What it does\nChecks for multiple `isinstance` calls on the same target.\n\n## Why is this bad?\nTo check if an object is an instance of any one of multiple types\nor classes, it is unnecessary to use multiple `isinstance` calls, as\nthe second argument of the `isinstance` built-in function accepts a\ntuple of types and classes.\n\nUsing a single `isinstance` call implements the same behavior with more\nconcise code and clearer intent.\n\n## Example\n```python\nif isinstance(obj, int) or isinstance(obj, float):\n    pass\n```\n\nUse instead:\n```python\nif isinstance(obj, (int, float)):\n    pass\n```\n\n## References\n- [Python documentation: `isinstance`](https://docs.python.org/3/library/functions.html#isinstance)\n",
    "fix": 1
  },
  {
    "name": "collapsible-if",
    "code": "SIM102",
    "explanation": "## What it does\nChecks for nested `if` statements that can be collapsed into a single `if`\nstatement.\n\n## Why is this bad?\nNesting `if` statements leads to deeper indentation and makes code harder to\nread. Instead, combine the conditions into a single `if` statement with an\n`and` operator.\n\n## Example\n```python\nif foo:\n    if bar:\n        ...\n```\n\nUse instead:\n```python\nif foo and bar:\n    ...\n```\n\n## References\n- [Python documentation: The `if` statement](https://docs.python.org/3/reference/compound_stmts.html#the-if-statement)\n- [Python documentation: Boolean operations](https://docs.python.org/3/reference/expressions.html#boolean-operations)\n",
    "fix": 1
  },
  {
    "name": "needless-bool",
    "code": "SIM103",
    "explanation": "## What it does\nChecks for `if` statements that can be replaced with `bool`.\n\n## Why is this bad?\n`if` statements that return `True` for a truthy condition and `False` for\na falsy condition can be replaced with boolean casts.\n\n## Example\nGiven:\n```python\nif x > 0:\n    return True\nelse:\n    return False\n```\n\nUse instead:\n```python\nreturn x > 0\n```\n\nOr, given:\n```python\nif x > 0:\n    return True\nreturn False\n```\n\nUse instead:\n```python\nreturn x > 0\n```\n\n## References\n- [Python documentation: Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)\n",
    "fix": 1
  },
  {
    "name": "suppressible-exception",
    "code": "SIM105",
    "explanation": "## What it does\nChecks for `try`-`except`-`pass` blocks that can be replaced with the\n`contextlib.suppress` context manager.\n\n## Why is this bad?\nUsing `contextlib.suppress` is more concise and directly communicates the\nintent of the code: to suppress a given exception.\n\nNote that `contextlib.suppress` is slower than using `try`-`except`-`pass`\ndirectly. For performance-critical code, consider retaining the\n`try`-`except`-`pass` pattern.\n\n## Example\n```python\ntry:\n    1 / 0\nexcept ZeroDivisionError:\n    pass\n```\n\nUse instead:\n```python\nimport contextlib\n\nwith contextlib.suppress(ZeroDivisionError):\n    1 / 0\n```\n\n## References\n- [Python documentation: `contextlib.suppress`](https://docs.python.org/3/library/contextlib.html#contextlib.suppress)\n- [Python documentation: `try` statement](https://docs.python.org/3/reference/compound_stmts.html#the-try-statement)\n- [a simpler `try`/`except` (and why maybe shouldn't)](https://www.youtube.com/watch?v=MZAJ8qnC7mk)\n",
    "fix": 1
  },
  {
    "name": "return-in-try-except-finally",
    "code": "SIM107",
    "explanation": "## What it does\nChecks for `return` statements in `try`-`except` and `finally` blocks.\n\n## Why is this bad?\nThe `return` statement in a `finally` block will always be executed, even if\nan exception is raised in the `try` or `except` block. This can lead to\nunexpected behavior.\n\n## Example\n```python\ndef squared(n):\n    try:\n        sqr = n**2\n        return sqr\n    except Exception:\n        return \"An exception occurred\"\n    finally:\n        return -1  # Always returns -1.\n```\n\nUse instead:\n```python\ndef squared(n):\n    try:\n        return_value = n**2\n    except Exception:\n        return_value = \"An exception occurred\"\n    finally:\n        return_value = -1\n    return return_value\n```\n\n## References\n- [Python documentation: Defining Clean-up Actions](https://docs.python.org/3/tutorial/errors.html#defining-clean-up-actions)\n"
  },
  {
    "name": "if-else-block-instead-of-if-exp",
    "code": "SIM108",
    "explanation": "## What it does\nCheck for `if`-`else`-blocks that can be replaced with a ternary operator.\nMoreover, in [preview], check if these ternary expressions can be\nfurther simplified to binary expressions.\n\n## Why is this bad?\n`if`-`else`-blocks that assign a value to a variable in both branches can\nbe expressed more concisely by using a ternary or binary operator.\n\n## Example\n\n```python\nif foo:\n    bar = x\nelse:\n    bar = y\n```\n\nUse instead:\n```python\nbar = x if foo else y\n```\n\nOr, in [preview]:\n\n```python\nif cond:\n    z = cond\nelse:\n    z = other_cond\n```\n\nUse instead:\n\n```python\nz = cond or other_cond\n```\n\n## Known issues\nThis is an opinionated style rule that may not always be to everyone's\ntaste, especially for code that makes use of complex `if` conditions.\nTernary operators can also make it harder to measure [code coverage]\nwith tools that use line profiling.\n\n## References\n- [Python documentation: Conditional expressions](https://docs.python.org/3/reference/expressions.html#conditional-expressions)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n[code coverage]: https://github.com/nedbat/coveragepy/issues/509\n",
    "fix": 1
  },
  {
    "name": "compare-with-tuple",
    "code": "SIM109",
    "explanation": "## What it does\nChecks for boolean expressions that contain multiple equality comparisons\nto the same value.\n\n## Why is this bad?\nTo check if an object is equal to any one of multiple values, it's more\nconcise to use the `in` operator with a tuple of values.\n\n## Example\n```python\nif foo == x or foo == y:\n    ...\n```\n\nUse instead:\n```python\nif foo in (x, y):\n    ...\n```\n\n## References\n- [Python documentation: Membership test operations](https://docs.python.org/3/reference/expressions.html#membership-test-operations)\n",
    "fix": 2
  },
  {
    "name": "reimplemented-builtin",
    "code": "SIM110",
    "explanation": "## What it does\nChecks for `for` loops that can be replaced with a builtin function, like\n`any` or `all`.\n\n## Why is this bad?\nUsing a builtin function is more concise and readable.\n\n## Example\n```python\nfor item in iterable:\n    if predicate(item):\n        return True\nreturn False\n```\n\nUse instead:\n```python\nreturn any(predicate(item) for item in iterable)\n```\n\n## References\n- [Python documentation: `any`](https://docs.python.org/3/library/functions.html#any)\n- [Python documentation: `all`](https://docs.python.org/3/library/functions.html#all)\n",
    "fix": 1
  },
  {
    "name": "uncapitalized-environment-variables",
    "code": "SIM112",
    "explanation": "## What it does\nCheck for environment variables that are not capitalized.\n\n## Why is this bad?\nBy convention, environment variables should be capitalized.\n\nOn Windows, environment variables are case-insensitive and are converted to\nuppercase, so using lowercase environment variables can lead to subtle bugs.\n\n## Example\n```python\nimport os\n\nos.environ[\"foo\"]\n```\n\nUse instead:\n```python\nimport os\n\nos.environ[\"FOO\"]\n```\n\n## References\n- [Python documentation: `os.environ`](https://docs.python.org/3/library/os.html#os.environ)\n",
    "fix": 1
  },
  {
    "name": "enumerate-for-loop",
    "code": "SIM113",
    "explanation": "## What it does\nChecks for `for` loops with explicit loop-index variables that can be replaced\nwith `enumerate()`.\n\n## Why is this bad?\nWhen iterating over a sequence, it's often desirable to keep track of the\nindex of each element alongside the element itself. Prefer the `enumerate`\nbuiltin over manually incrementing a counter variable within the loop, as\n`enumerate` is more concise and idiomatic.\n\n## Example\n```python\nfruits = [\"apple\", \"banana\", \"cherry\"]\nfor fruit in fruits:\n    print(f\"{i + 1}. {fruit}\")\n    i += 1\n```\n\nUse instead:\n```python\nfruits = [\"apple\", \"banana\", \"cherry\"]\nfor i, fruit in enumerate(fruits):\n    print(f\"{i + 1}. {fruit}\")\n```\n\n## References\n- [Python documentation: `enumerate`](https://docs.python.org/3/library/functions.html#enumerate)\n"
  },
  {
    "name": "if-with-same-arms",
    "code": "SIM114",
    "explanation": "## What it does\nChecks for `if` branches with identical arm bodies.\n\n## Why is this bad?\nIf multiple arms of an `if` statement have the same body, using `or`\nbetter signals the intent of the statement.\n\n## Example\n```python\nif x == 1:\n    print(\"Hello\")\nelif x == 2:\n    print(\"Hello\")\n```\n\nUse instead:\n```python\nif x == 1 or x == 2:\n    print(\"Hello\")\n```\n",
    "fix": 1
  },
  {
    "name": "open-file-with-context-handler",
    "code": "SIM115",
    "explanation": "## What it does\nChecks for cases where files are opened (e.g., using the builtin `open()` function)\nwithout using a context manager.\n\n## Why is this bad?\nIf a file is opened without a context manager, it is not guaranteed that\nthe file will be closed (e.g., if an exception is raised), which can cause\nresource leaks. The rule detects a wide array of IO calls where context managers\ncould be used, such as `open`, `pathlib.Path(...).open()`, `tempfile.TemporaryFile()`\nor`tarfile.TarFile(...).gzopen()`.\n\n## Example\n```python\nfile = open(\"foo.txt\")\n...\nfile.close()\n```\n\nUse instead:\n```python\nwith open(\"foo.txt\") as file:\n    ...\n```\n\n## References\n- [Python documentation: `open`](https://docs.python.org/3/library/functions.html#open)\n"
  },
  {
    "name": "if-else-block-instead-of-dict-lookup",
    "code": "SIM116",
    "explanation": "## What it does\nChecks for three or more consecutive if-statements with direct returns\n\n## Why is this bad?\nThese can be simplified by using a dictionary\n\n## Example\n```python\nif x == 1:\n    return \"Hello\"\nelif x == 2:\n    return \"Goodbye\"\nelse:\n    return \"Goodnight\"\n```\n\nUse instead:\n```python\nreturn {1: \"Hello\", 2: \"Goodbye\"}.get(x, \"Goodnight\")\n```\n"
  },
  {
    "name": "multiple-with-statements",
    "code": "SIM117",
    "explanation": "## What it does\nChecks for the unnecessary nesting of multiple consecutive context\nmanagers.\n\n## Why is this bad?\nIn Python 3, a single `with` block can include multiple context\nmanagers.\n\nCombining multiple context managers into a single `with` statement\nwill minimize the indentation depth of the code, making it more\nreadable.\n\nThe following context managers are exempt when used as standalone\nstatements:\n\n - `anyio`.{`CancelScope`, `fail_after`, `move_on_after`}\n - `asyncio`.{`timeout`, `timeout_at`}\n - `trio`.{`fail_after`, `fail_at`, `move_on_after`, `move_on_at`}\n\n## Example\n```python\nwith A() as a:\n    with B() as b:\n        pass\n```\n\nUse instead:\n```python\nwith A() as a, B() as b:\n    pass\n```\n\n## References\n- [Python documentation: The `with` statement](https://docs.python.org/3/reference/compound_stmts.html#the-with-statement)\n",
    "fix": 1
  },
  {
    "name": "in-dict-keys",
    "code": "SIM118",
    "explanation": "## What it does\nChecks for key-existence checks against `dict.keys()` calls.\n\n## Why is this bad?\nWhen checking for the existence of a key in a given dictionary, using\n`key in dict` is more readable and efficient than `key in dict.keys()`,\nwhile having the same semantics.\n\n## Example\n```python\nkey in foo.keys()\n```\n\nUse instead:\n```python\nkey in foo\n```\n\n## Fix safety\nGiven `key in obj.keys()`, `obj` _could_ be a dictionary, or it could be\nanother type that defines a `.keys()` method. In the latter case, removing\nthe `.keys()` attribute could lead to a runtime error. The fix is marked\nas safe when the type of `obj` is known to be a dictionary; otherwise, it\nis marked as unsafe.\n\n## References\n- [Python documentation: Mapping Types](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict)\n",
    "fix": 2
  },
  {
    "name": "negate-equal-op",
    "code": "SIM201",
    "explanation": "## What it does\nChecks for negated `==` operators.\n\n## Why is this bad?\nNegated `==` operators are less readable than `!=` operators. When testing\nfor non-equality, it is more common to use `!=` than `==`.\n\n## Example\n```python\nnot a == b\n```\n\nUse instead:\n```python\na != b\n```\n\n## Fix safety\nThe fix is marked as unsafe, as it might change the behaviour\nif `a` and/or `b` overrides `__eq__`/`__ne__`\nin such a manner that they don't return booleans.\n\n## References\n- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)\n",
    "fix": 2
  },
  {
    "name": "negate-not-equal-op",
    "code": "SIM202",
    "explanation": "## What it does\nChecks for negated `!=` operators.\n\n## Why is this bad?\nNegated `!=` operators are less readable than `==` operators, as they avoid a\ndouble negation.\n\n## Example\n```python\nnot a != b\n```\n\nUse instead:\n```python\na == b\n```\n\n## Fix safety\nThe fix is marked as unsafe, as it might change the behaviour\nif `a` and/or `b` overrides `__ne__`/`__eq__`\nin such a manner that they don't return booleans.\n\n## References\n- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)\n",
    "fix": 2
  },
  {
    "name": "double-negation",
    "code": "SIM208",
    "explanation": "## What it does\nChecks for double negations (i.e., multiple `not` operators).\n\n## Why is this bad?\nA double negation is redundant and less readable than omitting the `not`\noperators entirely.\n\n## Example\n```python\nnot (not a)\n```\n\nUse instead:\n```python\na\n```\n\n## References\n- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)\n",
    "fix": 2
  },
  {
    "name": "if-expr-with-true-false",
    "code": "SIM210",
    "explanation": "## What it does\nChecks for `if` expressions that can be replaced with `bool()` calls.\n\n## Why is this bad?\n`if` expressions that evaluate to `True` for a truthy condition an `False`\nfor a falsey condition can be replaced with `bool()` calls, which are more\nconcise and readable.\n\n## Example\n```python\nTrue if a else False\n```\n\nUse instead:\n```python\nbool(a)\n```\n\n## References\n- [Python documentation: Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)\n",
    "fix": 1
  },
  {
    "name": "if-expr-with-false-true",
    "code": "SIM211",
    "explanation": "## What it does\nChecks for `if` expressions that can be replaced by negating a given\ncondition.\n\n## Why is this bad?\n`if` expressions that evaluate to `False` for a truthy condition and `True`\nfor a falsey condition can be replaced with `not` operators, which are more\nconcise and readable.\n\n## Example\n```python\nFalse if a else True\n```\n\nUse instead:\n```python\nnot a\n```\n\n## References\n- [Python documentation: Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)\n",
    "fix": 2
  },
  {
    "name": "if-expr-with-twisted-arms",
    "code": "SIM212",
    "explanation": "## What it does\nChecks for `if` expressions that check against a negated condition.\n\n## Why is this bad?\n`if` expressions that check against a negated condition are more difficult\nto read than `if` expressions that check against the condition directly.\n\n## Example\n```python\nb if not a else a\n```\n\nUse instead:\n```python\na if a else b\n```\n\n## References\n- [Python documentation: Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)\n",
    "fix": 2
  },
  {
    "name": "expr-and-not-expr",
    "code": "SIM220",
    "explanation": "## What it does\nChecks for `and` expressions that include both an expression and its\nnegation.\n\n## Why is this bad?\nAn `and` expression that includes both an expression and its negation will\nalways evaluate to `False`.\n\n## Example\n```python\nx and not x\n```\n\n## References\n- [Python documentation: Boolean operations](https://docs.python.org/3/reference/expressions.html#boolean-operations)\n",
    "fix": 2
  },
  {
    "name": "expr-or-not-expr",
    "code": "SIM221",
    "explanation": "## What it does\nChecks for `or` expressions that include both an expression and its\nnegation.\n\n## Why is this bad?\nAn `or` expression that includes both an expression and its negation will\nalways evaluate to `True`.\n\n## Example\n```python\nx or not x\n```\n\n## References\n- [Python documentation: Boolean operations](https://docs.python.org/3/reference/expressions.html#boolean-operations)\n",
    "fix": 2
  },
  {
    "name": "expr-or-true",
    "code": "SIM222",
    "explanation": "## What it does\nChecks for `or` expressions that contain truthy values.\n\n## Why is this bad?\nIf the expression is used as a condition, it can be replaced in-full with\n`True`.\n\nIn other cases, the expression can be short-circuited to the first truthy\nvalue.\n\nBy using `True` (or the first truthy value), the code is more concise\nand easier to understand, since it no longer contains redundant conditions.\n\n## Example\n```python\nif x or [1] or y:\n    pass\n\na = x or [1] or y\n```\n\nUse instead:\n```python\nif True:\n    pass\n\na = x or [1]\n```\n",
    "fix": 2
  },
  {
    "name": "expr-and-false",
    "code": "SIM223",
    "explanation": "## What it does\nChecks for `and` expressions that contain falsey values.\n\n## Why is this bad?\nIf the expression is used as a condition, it can be replaced in-full with\n`False`.\n\nIn other cases, the expression can be short-circuited to the first falsey\nvalue.\n\nBy using `False` (or the first falsey value), the code is more concise\nand easier to understand, since it no longer contains redundant conditions.\n\n## Example\n```python\nif x and [] and y:\n    pass\n\na = x and [] and y\n```\n\nUse instead:\n```python\nif False:\n    pass\n\na = x and []\n```\n",
    "fix": 2
  },
  {
    "name": "yoda-conditions",
    "code": "SIM300",
    "explanation": "## What it does\nChecks for conditions that position a constant on the left-hand side of the\ncomparison operator, rather than the right-hand side.\n\n## Why is this bad?\nThese conditions (sometimes referred to as \"Yoda conditions\") are less\nreadable than conditions that place the variable on the left-hand side of\nthe comparison operator.\n\nIn some languages, Yoda conditions are used to prevent accidental\nassignment in conditions (i.e., accidental uses of the `=` operator,\ninstead of the `==` operator). However, Python does not allow assignments\nin conditions unless using the `:=` operator, so Yoda conditions provide\nno benefit in this regard.\n\n## Example\n```python\nif \"Foo\" == foo:\n    ...\n```\n\nUse instead:\n```python\nif foo == \"Foo\":\n    ...\n```\n\n## References\n- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)\n- [Python documentation: Assignment statements](https://docs.python.org/3/reference/simple_stmts.html#assignment-statements)\n",
    "fix": 1
  },
  {
    "name": "if-else-block-instead-of-dict-get",
    "code": "SIM401",
    "explanation": "## What it does\nChecks for `if` statements that can be replaced with `dict.get` calls.\n\n## Why is this bad?\n`dict.get()` calls can be used to replace `if` statements that assign a\nvalue to a variable in both branches, falling back to a default value if\nthe key is not found. When possible, using `dict.get` is more concise and\nmore idiomatic.\n\nUnder [preview mode](https://docs.astral.sh/ruff/preview), this rule will\nalso suggest replacing `if`-`else` _expressions_ with `dict.get` calls.\n\n## Example\n```python\nif \"bar\" in foo:\n    value = foo[\"bar\"]\nelse:\n    value = 0\n```\n\nUse instead:\n```python\nvalue = foo.get(\"bar\", 0)\n```\n\nIf preview mode is enabled:\n```python\nvalue = foo[\"bar\"] if \"bar\" in foo else 0\n```\n\nUse instead:\n```python\nvalue = foo.get(\"bar\", 0)\n```\n\n## References\n- [Python documentation: Mapping Types](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict)\n",
    "fix": 1
  },
  {
    "name": "split-static-string",
    "code": "SIM905",
    "explanation": "## What it does\nChecks for static `str.split` calls that can be replaced with list literals.\n\n## Why is this bad?\nList literals are more readable and do not require the overhead of calling `str.split`.\n\n## Example\n```python\n\"a,b,c,d\".split(\",\")\n```\n\nUse instead:\n```python\n[\"a\", \"b\", \"c\", \"d\"]\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe for implicit string concatenations with comments interleaved\nbetween segments, as comments may be removed.\n\nFor example, the fix would be marked as unsafe in the following case:\n```python\n(\n    \"a\"  # comment\n    \",\"  # comment\n    \"b\"  # comment\n).split(\",\")\n```\n\nas this is converted to `[\"a\", \"b\"]` without any of the comments.\n\n## References\n- [Python documentation: `str.split`](https://docs.python.org/3/library/stdtypes.html#str.split)\n",
    "fix": 1
  },
  {
    "name": "dict-get-with-none-default",
    "code": "SIM910",
    "explanation": "## What it does\nChecks for `dict.get()` calls that pass `None` as the default value.\n\n## Why is this bad?\n`None` is the default value for `dict.get()`, so it is redundant to pass it\nexplicitly.\n\n## Example\n```python\nages = {\"Tom\": 23, \"Maria\": 23, \"Dog\": 11}\nage = ages.get(\"Cat\", None)\n```\n\nUse instead:\n```python\nages = {\"Tom\": 23, \"Maria\": 23, \"Dog\": 11}\nage = ages.get(\"Cat\")\n```\n\n## References\n- [Python documentation: `dict.get`](https://docs.python.org/3/library/stdtypes.html#dict.get)\n",
    "fix": 2
  },
  {
    "name": "zip-dict-keys-and-values",
    "code": "SIM911",
    "explanation": "## What it does\nChecks for use of `zip()` to iterate over keys and values of a dictionary at once.\n\n## Why is this bad?\nThe `dict` type provides an `.items()` method which is faster and more readable.\n\n## Example\n```python\nflag_stars = {\"USA\": 50, \"Slovenia\": 3, \"Panama\": 2, \"Australia\": 6}\n\nfor country, stars in zip(flag_stars.keys(), flag_stars.values()):\n    print(f\"{country}'s flag has {stars} stars.\")\n```\n\nUse instead:\n```python\nflag_stars = {\"USA\": 50, \"Slovenia\": 3, \"Panama\": 2, \"Australia\": 6}\n\nfor country, stars in flag_stars.items():\n    print(f\"{country}'s flag has {stars} stars.\")\n```\n\n## References\n- [Python documentation: `dict.items`](https://docs.python.org/3/library/stdtypes.html#dict.items)\n",
    "fix": 2
  },
  {
    "name": "no-slots-in-str-subclass",
    "code": "SLOT000",
    "explanation": "## What it does\nChecks for subclasses of `str` that lack a `__slots__` definition.\n\n## Why is this bad?\nIn Python, the `__slots__` attribute allows you to explicitly define the\nattributes (instance variables) that a class can have. By default, Python\nuses a dictionary to store an object's attributes, which incurs some memory\noverhead. However, when `__slots__` is defined, Python uses a more compact\ninternal structure to store the object's attributes, resulting in memory\nsavings.\n\nSubclasses of `str` inherit all the attributes and methods of the built-in\n`str` class. Since strings are typically immutable, they don't require\nadditional attributes beyond what the `str` class provides. Defining\n`__slots__` for subclasses of `str` prevents the creation of a dictionary\nfor each instance, reducing memory consumption.\n\n## Example\n```python\nclass Foo(str):\n    pass\n```\n\nUse instead:\n```python\nclass Foo(str):\n    __slots__ = ()\n```\n\n## References\n- [Python documentation: `__slots__`](https://docs.python.org/3/reference/datamodel.html#slots)\n"
  },
  {
    "name": "no-slots-in-tuple-subclass",
    "code": "SLOT001",
    "explanation": "## What it does\nChecks for subclasses of `tuple` that lack a `__slots__` definition.\n\n## Why is this bad?\nIn Python, the `__slots__` attribute allows you to explicitly define the\nattributes (instance variables) that a class can have. By default, Python\nuses a dictionary to store an object's attributes, which incurs some memory\noverhead. However, when `__slots__` is defined, Python uses a more compact\ninternal structure to store the object's attributes, resulting in memory\nsavings.\n\nSubclasses of `tuple` inherit all the attributes and methods of the\nbuilt-in `tuple` class. Since tuples are typically immutable, they don't\nrequire additional attributes beyond what the `tuple` class provides.\nDefining `__slots__` for subclasses of `tuple` prevents the creation of a\ndictionary for each instance, reducing memory consumption.\n\n## Example\n```python\nclass Foo(tuple):\n    pass\n```\n\nUse instead:\n```python\nclass Foo(tuple):\n    __slots__ = ()\n```\n\n## References\n- [Python documentation: `__slots__`](https://docs.python.org/3/reference/datamodel.html#slots)\n"
  },
  {
    "name": "no-slots-in-namedtuple-subclass",
    "code": "SLOT002",
    "explanation": "## What it does\nChecks for subclasses of `collections.namedtuple` or `typing.NamedTuple`\nthat lack a `__slots__` definition.\n\n## Why is this bad?\nIn Python, the `__slots__` attribute allows you to explicitly define the\nattributes (instance variables) that a class can have. By default, Python\nuses a dictionary to store an object's attributes, which incurs some memory\noverhead. However, when `__slots__` is defined, Python uses a more compact\ninternal structure to store the object's attributes, resulting in memory\nsavings.\n\nSubclasses of `namedtuple` inherit all the attributes and methods of the\nbuilt-in `namedtuple` class. Since tuples are typically immutable, they\ndon't require additional attributes beyond what the `namedtuple` class\nprovides. Defining `__slots__` for subclasses of `namedtuple` prevents the\ncreation of a dictionary for each instance, reducing memory consumption.\n\n## Example\n```python\nfrom collections import namedtuple\n\n\nclass Foo(namedtuple(\"foo\", [\"str\", \"int\"])):\n    pass\n```\n\nUse instead:\n```python\nfrom collections import namedtuple\n\n\nclass Foo(namedtuple(\"foo\", [\"str\", \"int\"])):\n    __slots__ = ()\n```\n\n## References\n- [Python documentation: `__slots__`](https://docs.python.org/3/reference/datamodel.html#slots)\n"
  },
  {
    "name": "banned-api",
    "code": "TID251",
    "explanation": "## What it does\nChecks for banned imports.\n\n## Why is this bad?\nProjects may want to ensure that specific modules or module members are\nnot imported or accessed.\n\nSecurity or other company policies may be a reason to impose\nrestrictions on importing external Python libraries. In some cases,\nprojects may adopt conventions around the use of certain modules or\nmodule members that are not enforceable by the language itself.\n\nThis rule enforces certain import conventions project-wide automatically.\n\n## Options\n- `lint.flake8-tidy-imports.banned-api`\n"
  },
  {
    "name": "relative-imports",
    "code": "TID252",
    "explanation": "## What it does\nChecks for relative imports.\n\n## Why is this bad?\nAbsolute imports, or relative imports from siblings, are recommended by [PEP 8]:\n\n> Absolute imports are recommended, as they are usually more readable and tend to be better behaved...\n> ```python\n> import mypkg.sibling\n> from mypkg import sibling\n> from mypkg.sibling import example\n> ```\n> However, explicit relative imports are an acceptable alternative to absolute imports,\n> especially when dealing with complex package layouts where using absolute imports would be\n> unnecessarily verbose:\n> ```python\n> from . import sibling\n> from .sibling import example\n> ```\n\n## Example\n```python\nfrom .. import foo\n```\n\nUse instead:\n```python\nfrom mypkg import foo\n```\n\n## Options\n- `lint.flake8-tidy-imports.ban-relative-imports`\n\n[PEP 8]: https://peps.python.org/pep-0008/#imports\n",
    "fix": 1
  },
  {
    "name": "banned-module-level-imports",
    "code": "TID253",
    "explanation": "## What it does\nChecks for module-level imports that should instead be imported lazily\n(e.g., within a function definition, or an `if TYPE_CHECKING:` block, or\nsome other nested context).\n\n## Why is this bad?\nSome modules are expensive to import. For example, importing `torch` or\n`tensorflow` can introduce a noticeable delay in the startup time of a\nPython program.\n\nIn such cases, you may want to enforce that the module is imported lazily\nas needed, rather than at the top of the file. This could involve inlining\nthe import into the function that uses it, rather than importing it\nunconditionally, to ensure that the module is only imported when necessary.\n\n## Example\n```python\nimport tensorflow as tf\n\n\ndef show_version():\n    print(tf.__version__)\n```\n\nUse instead:\n```python\ndef show_version():\n    import tensorflow as tf\n\n    print(tf.__version__)\n```\n\n## Options\n- `lint.flake8-tidy-imports.banned-module-level-imports`\n"
  },
  {
    "name": "invalid-todo-tag",
    "code": "TD001",
    "explanation": "## What it does\nChecks that a TODO comment is labelled with \"TODO\".\n\n## Why is this bad?\nAmbiguous tags reduce code visibility and can lead to dangling TODOs.\nFor example, if a comment is tagged with \"FIXME\" rather than \"TODO\", it may\nbe overlooked by future readers.\n\nNote that this rule will only flag \"FIXME\" and \"XXX\" tags as incorrect.\n\n## Example\n```python\n# FIXME(ruff): this should get fixed!\n```\n\nUse instead:\n```python\n# TODO(ruff): this is now fixed!\n```\n"
  },
  {
    "name": "missing-todo-author",
    "code": "TD002",
    "explanation": "## What it does\nChecks that a TODO comment includes an author.\n\n## Why is this bad?\nIncluding an author on a TODO provides future readers with context around\nthe issue. While the TODO author is not always considered responsible for\nfixing the issue, they are typically the individual with the most context.\n\n## Example\n```python\n# TODO: should assign an author here\n```\n\nUse instead\n```python\n# TODO(charlie): now an author is assigned\n```\n"
  },
  {
    "name": "missing-todo-link",
    "code": "TD003",
    "explanation": "## What it does\nChecks that a TODO comment is associated with a link to a relevant issue\nor ticket.\n\n## Why is this bad?\nIncluding an issue link near a TODO makes it easier for resolvers\nto get context around the issue.\n\n## Example\n```python\n# TODO: this link has no issue\n```\n\nUse one of these instead:\n```python\n# TODO(charlie): this comment has an issue link\n# https://github.com/astral-sh/ruff/issues/3870\n\n# TODO(charlie): this comment has a 3-digit issue code\n# 003\n\n# TODO(charlie): https://github.com/astral-sh/ruff/issues/3870\n# this comment has an issue link\n\n# TODO(charlie): #003 this comment has a 3-digit issue code\n# with leading character `#`\n\n# TODO(charlie): this comment has an issue code (matches the regex `[A-Z]+\\-?\\d+`)\n# SIXCHR-003\n```\n"
  },
  {
    "name": "missing-todo-colon",
    "code": "TD004",
    "explanation": "## What it does\nChecks that a \"TODO\" tag is followed by a colon.\n\n## Why is this bad?\n\"TODO\" tags are typically followed by a parenthesized author name, a colon,\na space, and a description of the issue, in that order.\n\nDeviating from this pattern can lead to inconsistent and non-idiomatic\ncomments.\n\n## Example\n```python\n# TODO(charlie) fix this colon\n```\n\nUsed instead:\n```python\n# TODO(charlie): colon fixed\n```\n"
  },
  {
    "name": "missing-todo-description",
    "code": "TD005",
    "explanation": "## What it does\nChecks that a \"TODO\" tag contains a description of the issue following the\ntag itself.\n\n## Why is this bad?\nTODO comments should include a description of the issue to provide context\nfor future readers.\n\n## Example\n```python\n# TODO(charlie)\n```\n\nUse instead:\n```python\n# TODO(charlie): fix some issue\n```\n"
  },
  {
    "name": "invalid-todo-capitalization",
    "code": "TD006",
    "explanation": "## What it does\nChecks that a \"TODO\" tag is properly capitalized (i.e., that the tag is\nuppercase).\n\n## Why is this bad?\nCapitalizing the \"TODO\" in a TODO comment is a convention that makes it\neasier for future readers to identify TODOs.\n\n## Example\n```python\n# todo(charlie): capitalize this\n```\n\nUse instead:\n```python\n# TODO(charlie): this is capitalized\n```\n",
    "fix": 2
  },
  {
    "name": "missing-space-after-todo-colon",
    "code": "TD007",
    "explanation": "## What it does\nChecks that the colon after a \"TODO\" tag is followed by a space.\n\n## Why is this bad?\n\"TODO\" tags are typically followed by a parenthesized author name, a colon,\na space, and a description of the issue, in that order.\n\nDeviating from this pattern can lead to inconsistent and non-idiomatic\ncomments.\n\n## Example\n```python\n# TODO(charlie):fix this\n```\n\nUse instead:\n```python\n# TODO(charlie): fix this\n```\n"
  },
  {
    "name": "typing-only-first-party-import",
    "code": "TC001",
    "explanation": "## What it does\nChecks for first-party imports that are only used for type annotations, but\naren't defined in a type-checking block.\n\n## Why is this bad?\nUnused imports add a performance overhead at runtime, and risk creating\nimport cycles. If an import is _only_ used in typing-only contexts, it can\ninstead be imported conditionally under an `if TYPE_CHECKING:` block to\nminimize runtime overhead.\n\nIf [`lint.flake8-type-checking.quote-annotations`] is set to `true`,\nannotations will be wrapped in quotes if doing so would enable the\ncorresponding import to be moved into an `if TYPE_CHECKING:` block.\n\nIf a class _requires_ that type annotations be available at runtime (as is\nthe case for Pydantic, SQLAlchemy, and other libraries), consider using\nthe [`lint.flake8-type-checking.runtime-evaluated-base-classes`] and\n[`lint.flake8-type-checking.runtime-evaluated-decorators`] settings to mark them\nas such.\n\n## Example\n```python\nfrom __future__ import annotations\n\nimport local_module\n\n\ndef func(sized: local_module.Container) -> int:\n    return len(sized)\n```\n\nUse instead:\n```python\nfrom __future__ import annotations\n\nfrom typing import TYPE_CHECKING\n\nif TYPE_CHECKING:\n    import local_module\n\n\ndef func(sized: local_module.Container) -> int:\n    return len(sized)\n```\n\n## Options\n- `lint.flake8-type-checking.quote-annotations`\n- `lint.flake8-type-checking.runtime-evaluated-base-classes`\n- `lint.flake8-type-checking.runtime-evaluated-decorators`\n- `lint.flake8-type-checking.strict`\n- `lint.typing-modules`\n\n## References\n- [PEP 563: Runtime annotation resolution and `TYPE_CHECKING`](https://peps.python.org/pep-0563/#runtime-annotation-resolution-and-type-checking)\n",
    "fix": 1
  },
  {
    "name": "typing-only-third-party-import",
    "code": "TC002",
    "explanation": "## What it does\nChecks for third-party imports that are only used for type annotations, but\naren't defined in a type-checking block.\n\n## Why is this bad?\nUnused imports add a performance overhead at runtime, and risk creating\nimport cycles. If an import is _only_ used in typing-only contexts, it can\ninstead be imported conditionally under an `if TYPE_CHECKING:` block to\nminimize runtime overhead.\n\nIf [`lint.flake8-type-checking.quote-annotations`] is set to `true`,\nannotations will be wrapped in quotes if doing so would enable the\ncorresponding import to be moved into an `if TYPE_CHECKING:` block.\n\nIf a class _requires_ that type annotations be available at runtime (as is\nthe case for Pydantic, SQLAlchemy, and other libraries), consider using\nthe [`lint.flake8-type-checking.runtime-evaluated-base-classes`] and\n[`lint.flake8-type-checking.runtime-evaluated-decorators`] settings to mark them\nas such.\n\n## Example\n```python\nfrom __future__ import annotations\n\nimport pandas as pd\n\n\ndef func(df: pd.DataFrame) -> int:\n    return len(df)\n```\n\nUse instead:\n```python\nfrom __future__ import annotations\n\nfrom typing import TYPE_CHECKING\n\nif TYPE_CHECKING:\n    import pandas as pd\n\n\ndef func(df: pd.DataFrame) -> int:\n    return len(df)\n```\n\n## Options\n- `lint.flake8-type-checking.quote-annotations`\n- `lint.flake8-type-checking.runtime-evaluated-base-classes`\n- `lint.flake8-type-checking.runtime-evaluated-decorators`\n- `lint.flake8-type-checking.strict`\n- `lint.typing-modules`\n\n## References\n- [PEP 563: Runtime annotation resolution and `TYPE_CHECKING`](https://peps.python.org/pep-0563/#runtime-annotation-resolution-and-type-checking)\n",
    "fix": 1
  },
  {
    "name": "typing-only-standard-library-import",
    "code": "TC003",
    "explanation": "## What it does\nChecks for standard library imports that are only used for type\nannotations, but aren't defined in a type-checking block.\n\n## Why is this bad?\nUnused imports add a performance overhead at runtime, and risk creating\nimport cycles. If an import is _only_ used in typing-only contexts, it can\ninstead be imported conditionally under an `if TYPE_CHECKING:` block to\nminimize runtime overhead.\n\nIf [`lint.flake8-type-checking.quote-annotations`] is set to `true`,\nannotations will be wrapped in quotes if doing so would enable the\ncorresponding import to be moved into an `if TYPE_CHECKING:` block.\n\nIf a class _requires_ that type annotations be available at runtime (as is\nthe case for Pydantic, SQLAlchemy, and other libraries), consider using\nthe [`lint.flake8-type-checking.runtime-evaluated-base-classes`] and\n[`lint.flake8-type-checking.runtime-evaluated-decorators`] settings to mark them\nas such.\n\n## Example\n```python\nfrom __future__ import annotations\n\nfrom pathlib import Path\n\n\ndef func(path: Path) -> str:\n    return str(path)\n```\n\nUse instead:\n```python\nfrom __future__ import annotations\n\nfrom typing import TYPE_CHECKING\n\nif TYPE_CHECKING:\n    from pathlib import Path\n\n\ndef func(path: Path) -> str:\n    return str(path)\n```\n\n## Options\n- `lint.flake8-type-checking.quote-annotations`\n- `lint.flake8-type-checking.runtime-evaluated-base-classes`\n- `lint.flake8-type-checking.runtime-evaluated-decorators`\n- `lint.flake8-type-checking.strict`\n- `lint.typing-modules`\n\n## References\n- [PEP 563: Runtime annotation resolution and `TYPE_CHECKING`](https://peps.python.org/pep-0563/#runtime-annotation-resolution-and-type-checking)\n",
    "fix": 1
  },
  {
    "name": "runtime-import-in-type-checking-block",
    "code": "TC004",
    "explanation": "## What it does\nChecks for imports that are required at runtime but are only defined in\ntype-checking blocks.\n\n## Why is this bad?\nThe type-checking block is not executed at runtime, so if the only definition\nof a symbol is in a type-checking block, it will not be available at runtime.\n\nIf [`lint.flake8-type-checking.quote-annotations`] is set to `true`,\nannotations will be wrapped in quotes if doing so would enable the\ncorresponding import to remain in the type-checking block.\n\n## Example\n```python\nfrom typing import TYPE_CHECKING\n\nif TYPE_CHECKING:\n    import foo\n\n\ndef bar() -> None:\n    foo.bar()  # raises NameError: name 'foo' is not defined\n```\n\nUse instead:\n```python\nimport foo\n\n\ndef bar() -> None:\n    foo.bar()\n```\n\n## Options\n- `lint.flake8-type-checking.quote-annotations`\n\n## References\n- [PEP 563: Runtime annotation resolution and `TYPE_CHECKING`](https://peps.python.org/pep-0563/#runtime-annotation-resolution-and-type-checking)\n",
    "fix": 1
  },
  {
    "name": "empty-type-checking-block",
    "code": "TC005",
    "explanation": "## What it does\nChecks for an empty type-checking block.\n\n## Why is this bad?\nThe type-checking block does not do anything and should be removed to avoid\nconfusion.\n\n## Example\n```python\nfrom typing import TYPE_CHECKING\n\nif TYPE_CHECKING:\n    pass\n\nprint(\"Hello, world!\")\n```\n\nUse instead:\n```python\nprint(\"Hello, world!\")\n```\n\n## References\n- [PEP 563: Runtime annotation resolution and `TYPE_CHECKING`](https://peps.python.org/pep-0563/#runtime-annotation-resolution-and-type-checking)\n",
    "fix": 2
  },
  {
    "name": "runtime-cast-value",
    "code": "TC006",
    "explanation": "## What it does\nChecks for unquoted type expressions in `typing.cast()` calls.\n\n## Why is this bad?\nThis rule helps enforce a consistent style across your codebase.\n\nIt's often necessary to quote the first argument passed to `cast()`,\nas type expressions can involve forward references, or references\nto symbols which are only imported in `typing.TYPE_CHECKING` blocks.\nThis can lead to a visual inconsistency across different `cast()` calls,\nwhere some type expressions are quoted but others are not. By enabling\nthis rule, you ensure that all type expressions passed to `cast()` are\nquoted, enforcing stylistic consistency across all of your `cast()` calls.\n\nIn some cases where `cast()` is used in a hot loop, this rule may also\nhelp avoid overhead from repeatedly evaluating complex type expressions at\nruntime.\n\n## Example\n```python\nfrom typing import cast\n\nx = cast(dict[str, int], foo)\n```\n\nUse instead:\n```python\nfrom typing import cast\n\nx = cast(\"dict[str, int]\", foo)\n```\n\n## Fix safety\nThis fix is safe as long as the type expression doesn't span multiple\nlines and includes comments on any of the lines apart from the last one.\n",
    "fix": 2
  },
  {
    "name": "unquoted-type-alias",
    "code": "TC007",
    "explanation": "## What it does\nChecks if [PEP 613] explicit type aliases contain references to\nsymbols that are not available at runtime.\n\n## Why is this bad?\nReferencing type-checking only symbols results in a `NameError` at runtime.\n\n## Example\n```python\nfrom typing import TYPE_CHECKING, TypeAlias\n\nif TYPE_CHECKING:\n    from foo import Foo\nOptFoo: TypeAlias = Foo | None\n```\n\nUse instead:\n```python\nfrom typing import TYPE_CHECKING, TypeAlias\n\nif TYPE_CHECKING:\n    from foo import Foo\nOptFoo: TypeAlias = \"Foo | None\"\n```\n\n## Fix safety\nThis rule's fix is currently always marked as unsafe, since runtime\ntyping libraries may try to access/resolve the type alias in a way\nthat we can't statically determine during analysis and relies on the\ntype alias not containing any forward references.\n\n## References\n- [PEP 613 \u2013 Explicit Type Aliases](https://peps.python.org/pep-0613/)\n\n[PEP 613]: https://peps.python.org/pep-0613/\n",
    "fix": 1
  },
  {
    "name": "quoted-type-alias",
    "code": "TC008",
    "explanation": "## What it does\nChecks for unnecessary quotes in [PEP 613] explicit type aliases\nand [PEP 695] type statements.\n\n## Why is this bad?\nUnnecessary string forward references can lead to additional overhead\nin runtime libraries making use of type hints. They can also have bad\ninteractions with other runtime uses like [PEP 604] type unions.\n\nPEP-613 type aliases are only flagged by the rule if Ruff can have high\nconfidence that the quotes are unnecessary. Specifically, any PEP-613\ntype alias where the type expression on the right-hand side contains\nsubscripts or attribute accesses will not be flagged. This is because\ntype aliases can reference types that are, for example, generic in stub\nfiles but not at runtime. That can mean that a type checker expects the\nreferenced type to be subscripted with type arguments despite the fact\nthat doing so would fail at runtime if the type alias value was not\nquoted. Similarly, a type alias might need to reference a module-level\nattribute that exists in a stub file but not at runtime, meaning that\nthe type alias value would need to be quoted to avoid a runtime error.\n\n## Example\nGiven:\n```python\nOptInt: TypeAlias = \"int | None\"\n```\n\nUse instead:\n```python\nOptInt: TypeAlias = int | None\n```\n\nGiven:\n```python\ntype OptInt = \"int | None\"\n```\n\nUse instead:\n```python\ntype OptInt = int | None\n```\n\n## Fix safety\nThis rule's fix is marked as safe, unless the type annotation contains comments.\n\n## See also\nThis rule only applies to type aliases in non-stub files. For removing quotes in other\ncontexts or in stub files, see:\n\n- [`quoted-annotation-in-stub`][PYI020]: A rule that\n  removes all quoted annotations from stub files\n- [`quoted-annotation`][UP037]: A rule that removes unnecessary quotes\n  from *annotations* in runtime files.\n\n## References\n- [PEP 613 \u2013 Explicit Type Aliases](https://peps.python.org/pep-0613/)\n- [PEP 695: Generic Type Alias](https://peps.python.org/pep-0695/#generic-type-alias)\n- [PEP 604 \u2013 Allow writing union types as `X | Y`](https://peps.python.org/pep-0604/)\n\n[PEP 604]: https://peps.python.org/pep-0604/\n[PEP 613]: https://peps.python.org/pep-0613/\n[PEP 695]: https://peps.python.org/pep-0695/#generic-type-alias\n[PYI020]: https://docs.astral.sh/ruff/rules/quoted-annotation-in-stub/\n[UP037]: https://docs.astral.sh/ruff/rules/quoted-annotation/\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "runtime-string-union",
    "code": "TC010",
    "explanation": "## What it does\nChecks for the presence of string literals in `X | Y`-style union types.\n\n## Why is this bad?\n[PEP 604] introduced a new syntax for union type annotations based on the\n`|` operator.\n\nWhile Python's type annotations can typically be wrapped in strings to\navoid runtime evaluation, the use of a string member within an `X | Y`-style\nunion type will cause a runtime error.\n\nInstead, remove the quotes, wrap the _entire_ union in quotes, or use\n`from __future__ import annotations` to disable runtime evaluation of\nannotations entirely.\n\n## Example\n```python\nvar: str | \"int\"\n```\n\nUse instead:\n```python\nvar: str | int\n```\n\nOr, extend the quotes to include the entire union:\n```python\nvar: \"str | int\"\n```\n\n## References\n- [PEP 563 - Postponed Evaluation of Annotations](https://peps.python.org/pep-0563/)\n- [PEP 604 \u2013 Allow writing union types as `X | Y`](https://peps.python.org/pep-0604/)\n\n[PEP 604]: https://peps.python.org/pep-0604/\n"
  },
  {
    "name": "unused-function-argument",
    "code": "ARG001",
    "explanation": "## What it does\nChecks for the presence of unused arguments in function definitions.\n\n## Why is this bad?\nAn argument that is defined but not used is likely a mistake, and should\nbe removed to avoid confusion.\n\nIf a variable is intentionally defined-but-not-used, it should be\nprefixed with an underscore, or some other value that adheres to the\n[`lint.dummy-variable-rgx`] pattern.\n\n## Example\n```python\ndef foo(bar, baz):\n    return bar * 2\n```\n\nUse instead:\n```python\ndef foo(bar):\n    return bar * 2\n```\n\n## Options\n- `lint.dummy-variable-rgx`\n"
  },
  {
    "name": "unused-method-argument",
    "code": "ARG002",
    "explanation": "## What it does\nChecks for the presence of unused arguments in instance method definitions.\n\n## Why is this bad?\nAn argument that is defined but not used is likely a mistake, and should\nbe removed to avoid confusion.\n\nIf a variable is intentionally defined-but-not-used, it should be\nprefixed with an underscore, or some other value that adheres to the\n[`lint.dummy-variable-rgx`] pattern.\n\n## Example\n```python\nclass Class:\n    def foo(self, arg1, arg2):\n        print(arg1)\n```\n\nUse instead:\n```python\nclass Class:\n    def foo(self, arg1):\n        print(arg1)\n```\n\n## Options\n- `lint.dummy-variable-rgx`\n"
  },
  {
    "name": "unused-class-method-argument",
    "code": "ARG003",
    "explanation": "## What it does\nChecks for the presence of unused arguments in class method definitions.\n\n## Why is this bad?\nAn argument that is defined but not used is likely a mistake, and should\nbe removed to avoid confusion.\n\nIf a variable is intentionally defined-but-not-used, it should be\nprefixed with an underscore, or some other value that adheres to the\n[`lint.dummy-variable-rgx`] pattern.\n\n## Example\n```python\nclass Class:\n    @classmethod\n    def foo(cls, arg1, arg2):\n        print(arg1)\n```\n\nUse instead:\n```python\nclass Class:\n    @classmethod\n    def foo(cls, arg1):\n        print(arg1)\n```\n\n## Options\n- `lint.dummy-variable-rgx`\n"
  },
  {
    "name": "unused-static-method-argument",
    "code": "ARG004",
    "explanation": "## What it does\nChecks for the presence of unused arguments in static method definitions.\n\n## Why is this bad?\nAn argument that is defined but not used is likely a mistake, and should\nbe removed to avoid confusion.\n\nIf a variable is intentionally defined-but-not-used, it should be\nprefixed with an underscore, or some other value that adheres to the\n[`lint.dummy-variable-rgx`] pattern.\n\n## Example\n```python\nclass Class:\n    @staticmethod\n    def foo(arg1, arg2):\n        print(arg1)\n```\n\nUse instead:\n```python\nclass Class:\n    @staticmethod\n    def foo(arg1):\n        print(arg1)\n```\n\n## Options\n- `lint.dummy-variable-rgx`\n"
  },
  {
    "name": "unused-lambda-argument",
    "code": "ARG005",
    "explanation": "## What it does\nChecks for the presence of unused arguments in lambda expression\ndefinitions.\n\n## Why is this bad?\nAn argument that is defined but not used is likely a mistake, and should\nbe removed to avoid confusion.\n\nIf a variable is intentionally defined-but-not-used, it should be\nprefixed with an underscore, or some other value that adheres to the\n[`lint.dummy-variable-rgx`] pattern.\n\n## Example\n```python\nmy_list = [1, 2, 3, 4, 5]\nsquares = map(lambda x, y: x**2, my_list)\n```\n\nUse instead:\n```python\nmy_list = [1, 2, 3, 4, 5]\nsquares = map(lambda x: x**2, my_list)\n```\n\n## Options\n- `lint.dummy-variable-rgx`\n"
  },
  {
    "name": "os-path-abspath",
    "code": "PTH100",
    "explanation": "## What it does\nChecks for uses of `os.path.abspath`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.resolve()` can improve readability over the `os.path`\nmodule's counterparts (e.g., `os.path.abspath()`).\n\n## Examples\n```python\nimport os\n\nfile_path = os.path.abspath(\"../path/to/file\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nfile_path = Path(\"../path/to/file\").resolve()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.resolve`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.resolve)\n- [Python documentation: `os.path.abspath`](https://docs.python.org/3/library/os.path.html#os.path.abspath)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-chmod",
    "code": "PTH101",
    "explanation": "## What it does\nChecks for uses of `os.chmod`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.chmod()` can improve readability over the `os`\nmodule's counterparts (e.g., `os.chmod()`).\n\n## Examples\n```python\nimport os\n\nos.chmod(\"file.py\", 0o444)\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"file.py\").chmod(0o444)\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.chmod`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.chmod)\n- [Python documentation: `os.chmod`](https://docs.python.org/3/library/os.html#os.chmod)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-mkdir",
    "code": "PTH102",
    "explanation": "## What it does\nChecks for uses of `os.mkdir`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.mkdir()` can improve readability over the `os`\nmodule's counterparts (e.g., `os.mkdir()`).\n\n## Examples\n```python\nimport os\n\nos.mkdir(\"./directory/\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"./directory/\").mkdir()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.mkdir`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.mkdir)\n- [Python documentation: `os.mkdir`](https://docs.python.org/3/library/os.html#os.mkdir)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-makedirs",
    "code": "PTH103",
    "explanation": "## What it does\nChecks for uses of `os.makedirs`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.mkdir(parents=True)` can improve readability over the\n`os` module's counterparts (e.g., `os.makedirs()`.\n\n## Examples\n```python\nimport os\n\nos.makedirs(\"./nested/directory/\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"./nested/directory/\").mkdir(parents=True)\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.mkdir`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.mkdir)\n- [Python documentation: `os.makedirs`](https://docs.python.org/3/library/os.html#os.makedirs)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-rename",
    "code": "PTH104",
    "explanation": "## What it does\nChecks for uses of `os.rename`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.rename()` can improve readability over the `os`\nmodule's counterparts (e.g., `os.rename()`).\n\n## Examples\n```python\nimport os\n\nos.rename(\"old.py\", \"new.py\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"old.py\").rename(\"new.py\")\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.rename`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.rename)\n- [Python documentation: `os.rename`](https://docs.python.org/3/library/os.html#os.rename)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-replace",
    "code": "PTH105",
    "explanation": "## What it does\nChecks for uses of `os.replace`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.replace()` can improve readability over the `os`\nmodule's counterparts (e.g., `os.replace()`).\n\nNote that `os` functions may be preferable if performance is a concern,\ne.g., in hot loops.\n\n## Examples\n```python\nimport os\n\nos.replace(\"old.py\", \"new.py\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"old.py\").replace(\"new.py\")\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.replace`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.replace)\n- [Python documentation: `os.replace`](https://docs.python.org/3/library/os.html#os.replace)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-rmdir",
    "code": "PTH106",
    "explanation": "## What it does\nChecks for uses of `os.rmdir`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.rmdir()` can improve readability over the `os`\nmodule's counterparts (e.g., `os.rmdir()`).\n\n## Examples\n```python\nimport os\n\nos.rmdir(\"folder/\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"folder/\").rmdir()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.rmdir`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.rmdir)\n- [Python documentation: `os.rmdir`](https://docs.python.org/3/library/os.html#os.rmdir)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-remove",
    "code": "PTH107",
    "explanation": "## What it does\nChecks for uses of `os.remove`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.unlink()` can improve readability over the `os`\nmodule's counterparts (e.g., `os.remove()`).\n\n## Examples\n```python\nimport os\n\nos.remove(\"file.py\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"file.py\").unlink()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.unlink`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.unlink)\n- [Python documentation: `os.remove`](https://docs.python.org/3/library/os.html#os.remove)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-unlink",
    "code": "PTH108",
    "explanation": "## What it does\nChecks for uses of `os.unlink`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.unlink()` can improve readability over the `os`\nmodule's counterparts (e.g., `os.unlink()`).\n\n## Examples\n```python\nimport os\n\nos.unlink(\"file.py\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"file.py\").unlink()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.unlink`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.unlink)\n- [Python documentation: `os.unlink`](https://docs.python.org/3/library/os.html#os.unlink)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-getcwd",
    "code": "PTH109",
    "explanation": "## What it does\nChecks for uses of `os.getcwd` and `os.getcwdb`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.cwd()` can improve readability over the `os`\nmodule's counterparts (e.g., `os.getcwd()`).\n\n## Examples\n```python\nimport os\n\ncwd = os.getcwd()\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\ncwd = Path.cwd()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.cwd`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.cwd)\n- [Python documentation: `os.getcwd`](https://docs.python.org/3/library/os.html#os.getcwd)\n- [Python documentation: `os.getcwdb`](https://docs.python.org/3/library/os.html#os.getcwdb)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-exists",
    "code": "PTH110",
    "explanation": "## What it does\nChecks for uses of `os.path.exists`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.exists()` can improve readability over the `os.path`\nmodule's counterparts (e.g., `os.path.exists()`).\n\n## Examples\n```python\nimport os\n\nos.path.exists(\"file.py\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"file.py\").exists()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.exists`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.exists)\n- [Python documentation: `os.path.exists`](https://docs.python.org/3/library/os.path.html#os.path.exists)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-expanduser",
    "code": "PTH111",
    "explanation": "## What it does\nChecks for uses of `os.path.expanduser`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.expanduser()` can improve readability over the `os.path`\nmodule's counterparts (e.g., as `os.path.expanduser()`).\n\n## Examples\n```python\nimport os\n\nos.path.expanduser(\"~/films/Monty Python\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"~/films/Monty Python\").expanduser()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.expanduser`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.expanduser)\n- [Python documentation: `os.path.expanduser`](https://docs.python.org/3/library/os.path.html#os.path.expanduser)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-isdir",
    "code": "PTH112",
    "explanation": "## What it does\nChecks for uses of `os.path.isdir`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.is_dir()` can improve readability over the `os.path`\nmodule's counterparts (e.g., `os.path.isdir()`).\n\n## Examples\n```python\nimport os\n\nos.path.isdir(\"docs\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"docs\").is_dir()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.is_dir`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.is_dir)\n- [Python documentation: `os.path.isdir`](https://docs.python.org/3/library/os.path.html#os.path.isdir)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-isfile",
    "code": "PTH113",
    "explanation": "## What it does\nChecks for uses of `os.path.isfile`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.is_file()` can improve readability over the `os.path`\nmodule's counterparts (e.g., `os.path.isfile()`).\n\n## Examples\n```python\nimport os\n\nos.path.isfile(\"docs\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"docs\").is_file()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.is_file`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.is_file)\n- [Python documentation: `os.path.isfile`](https://docs.python.org/3/library/os.path.html#os.path.isfile)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-islink",
    "code": "PTH114",
    "explanation": "## What it does\nChecks for uses of `os.path.islink`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.is_symlink()` can improve readability over the `os.path`\nmodule's counterparts (e.g., `os.path.islink()`).\n\n## Examples\n```python\nimport os\n\nos.path.islink(\"docs\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"docs\").is_symlink()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.is_symlink`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.is_symlink)\n- [Python documentation: `os.path.islink`](https://docs.python.org/3/library/os.path.html#os.path.islink)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-readlink",
    "code": "PTH115",
    "explanation": "## What it does\nChecks for uses of `os.readlink`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.readlink()` can improve readability over the `os`\nmodule's counterparts (e.g., `os.readlink()`).\n\n## Examples\n```python\nimport os\n\nos.readlink(file_name)\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(file_name).readlink()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.readlink`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.readline)\n- [Python documentation: `os.readlink`](https://docs.python.org/3/library/os.html#os.readlink)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-stat",
    "code": "PTH116",
    "explanation": "## What it does\nChecks for uses of `os.stat`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `Path` object\nmethods such as `Path.stat()` can improve readability over the `os`\nmodule's counterparts (e.g., `os.path.stat()`).\n\n## Examples\n```python\nimport os\nfrom pwd import getpwuid\nfrom grp import getgrgid\n\nstat = os.stat(file_name)\nowner_name = getpwuid(stat.st_uid).pw_name\ngroup_name = getgrgid(stat.st_gid).gr_name\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nfile_path = Path(file_name)\nstat = file_path.stat()\nowner_name = file_path.owner()\ngroup_name = file_path.group()\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.stat`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.stat)\n- [Python documentation: `Path.group`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.group)\n- [Python documentation: `Path.owner`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.owner)\n- [Python documentation: `os.stat`](https://docs.python.org/3/library/os.html#os.stat)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-isabs",
    "code": "PTH117",
    "explanation": "## What it does\nChecks for uses of `os.path.isabs`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.is_absolute()` can improve readability over the `os.path`\nmodule's counterparts (e.g.,  as `os.path.isabs()`).\n\n## Examples\n```python\nimport os\n\nif os.path.isabs(file_name):\n    print(\"Absolute path!\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nif Path(file_name).is_absolute():\n    print(\"Absolute path!\")\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `PurePath.is_absolute`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.is_absolute)\n- [Python documentation: `os.path.isabs`](https://docs.python.org/3/library/os.path.html#os.path.isabs)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-join",
    "code": "PTH118",
    "explanation": "## What it does\nChecks for uses of `os.path.join`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.joinpath()` or the `/` operator can improve\nreadability over the `os.path` module's counterparts (e.g., `os.path.join()`).\n\n## Examples\n```python\nimport os\n\nos.path.join(os.path.join(ROOT_PATH, \"folder\"), \"file.py\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(ROOT_PATH) / \"folder\" / \"file.py\"\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `PurePath.joinpath`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.joinpath)\n- [Python documentation: `os.path.join`](https://docs.python.org/3/library/os.path.html#os.path.join)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-basename",
    "code": "PTH119",
    "explanation": "## What it does\nChecks for uses of `os.path.basename`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.name` can improve readability over the `os.path`\nmodule's counterparts (e.g., `os.path.basename()`).\n\n## Examples\n```python\nimport os\n\nos.path.basename(__file__)\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(__file__).name\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `PurePath.name`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.name)\n- [Python documentation: `os.path.basename`](https://docs.python.org/3/library/os.path.html#os.path.basename)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-dirname",
    "code": "PTH120",
    "explanation": "## What it does\nChecks for uses of `os.path.dirname`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.parent` can improve readability over the `os.path`\nmodule's counterparts (e.g., `os.path.dirname()`).\n\n## Examples\n```python\nimport os\n\nos.path.dirname(__file__)\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(__file__).parent\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `PurePath.parent`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.parent)\n- [Python documentation: `os.path.dirname`](https://docs.python.org/3/library/os.path.html#os.path.dirname)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-samefile",
    "code": "PTH121",
    "explanation": "## What it does\nChecks for uses of `os.path.samefile`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.samefile()` can improve readability over the `os.path`\nmodule's counterparts (e.g., `os.path.samefile()`).\n\n## Examples\n```python\nimport os\n\nos.path.samefile(\"f1.py\", \"f2.py\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"f1.py\").samefile(\"f2.py\")\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.samefile`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.samefile)\n- [Python documentation: `os.path.samefile`](https://docs.python.org/3/library/os.path.html#os.path.samefile)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-splitext",
    "code": "PTH122",
    "explanation": "## What it does\nChecks for uses of `os.path.splitext`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`. When possible, using `Path` object\nmethods such as `Path.suffix` and `Path.stem` can improve readability over\nthe `os.path` module's counterparts (e.g., `os.path.splitext()`).\n\n`os.path.splitext()` specifically returns a tuple of the file root and\nextension (e.g., given `splitext('/foo/bar.py')`, `os.path.splitext()`\nreturns `(\"foo/bar\", \".py\")`. These outputs can be reconstructed through a\ncombination of `Path.suffix` (`\".py\"`), `Path.stem` (`\"bar\"`), and\n`Path.parent` (`\"foo\"`).\n\n## Examples\n```python\nimport os\n\n(root, ext) = os.path.splitext(\"foo/bar.py\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\npath = Path(\"foo/bar.py\")\nroot = path.parent / path.stem\next = path.suffix\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.suffix`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.suffix)\n- [Python documentation: `Path.suffixes`](https://docs.python.org/3/library/pathlib.html#pathlib.PurePath.suffixes)\n- [Python documentation: `os.path.splitext`](https://docs.python.org/3/library/os.path.html#os.path.splitext)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "builtin-open",
    "code": "PTH123",
    "explanation": "## What it does\nChecks for uses of the `open()` builtin.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation. When possible,\nusing `Path` object methods such as `Path.open()` can improve readability\nover the `open` builtin.\n\n## Examples\n```python\nwith open(\"f1.py\", \"wb\") as fp:\n    ...\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nwith Path(\"f1.py\").open(\"wb\") as fp:\n    ...\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than working directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.open`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.open)\n- [Python documentation: `open`](https://docs.python.org/3/library/functions.html#open)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "py-path",
    "code": "PTH124",
    "explanation": "## What it does\nChecks for uses of the `py.path` library.\n\n## Why is this bad?\nThe `py.path` library is in maintenance mode. Instead, prefer the standard\nlibrary's `pathlib` module, or third-party modules like `path` (formerly\n`py.path`).\n\n## Examples\n```python\nimport py.path\n\np = py.path.local(\"/foo/bar\").join(\"baz/qux\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\np = Path(\"/foo/bar\") / \"bar\" / \"qux\"\n```\n\n## References\n- [Python documentation: `Pathlib`](https://docs.python.org/3/library/pathlib.html)\n- [Path repository](https://github.com/jaraco/path)\n"
  },
  {
    "name": "path-constructor-current-directory",
    "code": "PTH201",
    "explanation": "## What it does\nChecks for `pathlib.Path` objects that are initialized with the current\ndirectory.\n\n## Why is this bad?\nThe `Path()` constructor defaults to the current directory, so passing it\nin explicitly (as `\".\"`) is unnecessary.\n\n## Example\n```python\nfrom pathlib import Path\n\n_ = Path(\".\")\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\n_ = Path()\n```\n\n## References\n- [Python documentation: `Path`](https://docs.python.org/3/library/pathlib.html#pathlib.Path)\n",
    "fix": 2
  },
  {
    "name": "os-path-getsize",
    "code": "PTH202",
    "explanation": "## What it does\nChecks for uses of `os.path.getsize`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`.\n\nWhen possible, using `Path` object methods such as `Path.stat()` can\nimprove readability over the `os.path` module's counterparts (e.g.,\n`os.path.getsize()`).\n\n## Example\n```python\nimport os\n\nos.path.getsize(__file__)\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(__file__).stat().st_size\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.stat`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.stat)\n- [Python documentation: `os.path.getsize`](https://docs.python.org/3/library/os.path.html#os.path.getsize)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-getatime",
    "code": "PTH203",
    "explanation": "## What it does\nChecks for uses of `os.path.getatime`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`.\n\nWhen possible, using `Path` object methods such as `Path.stat()` can\nimprove readability over the `os.path` module's counterparts (e.g.,\n`os.path.getatime()`).\n\n## Example\n```python\nimport os\n\nos.path.getatime(__file__)\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(__file__).stat().st_atime\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.stat`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.stat)\n- [Python documentation: `os.path.getatime`](https://docs.python.org/3/library/os.path.html#os.path.getatime)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-getmtime",
    "code": "PTH204",
    "explanation": "## What it does\nChecks for uses of `os.path.getmtime`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`.\n\nWhen possible, using `Path` object methods such as `Path.stat()` can\nimprove readability over the `os.path` module's counterparts (e.g.,\n`os.path.getmtime()`).\n\n## Example\n```python\nimport os\n\nos.path.getmtime(__file__)\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(__file__).stat().st_mtime\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.stat`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.stat)\n- [Python documentation: `os.path.getmtime`](https://docs.python.org/3/library/os.path.html#os.path.getmtime)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-path-getctime",
    "code": "PTH205",
    "explanation": "## What it does\nChecks for uses of `os.path.getctime`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os.path`.\n\nWhen possible, using `Path` object methods such as `Path.stat()` can\nimprove readability over the `os.path` module's counterparts (e.g.,\n`os.path.getctime()`).\n\n## Example\n```python\nimport os\n\nos.path.getctime(__file__)\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(__file__).stat().st_ctime\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.stat`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.stat)\n- [Python documentation: `os.path.getctime`](https://docs.python.org/3/library/os.path.html#os.path.getctime)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-sep-split",
    "code": "PTH206",
    "explanation": "## What it does\nChecks for uses of `.split(os.sep)`\n\n## Why is this bad?\nThe `pathlib` module in the standard library should be used for path\nmanipulation. It provides a high-level API with the functionality\nneeded for common operations on `Path` objects.\n\n## Example\nIf not all parts of the path are needed, then the `name` and `parent`\nattributes of the `Path` object should be used. Otherwise, the `parts`\nattribute can be used as shown in the last example.\n```python\nimport os\n\n\"path/to/file_name.txt\".split(os.sep)[-1]\n\n\"path/to/file_name.txt\".split(os.sep)[-2]\n\n# Iterating over the path parts\nif any(part in blocklist for part in \"my/file/path\".split(os.sep)):\n    ...\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"path/to/file_name.txt\").name\n\nPath(\"path/to/file_name.txt\").parent.name\n\n# Iterating over the path parts\nif any(part in blocklist for part in Path(\"my/file/path\").parts):\n    ...\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than working directly with strings,\nespecially on older versions of Python.\n\n## References\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "glob",
    "code": "PTH207",
    "explanation": "## What it does\nChecks for the use of `glob.glob()` and `glob.iglob()`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os` and `glob`.\n\nWhen possible, using `Path` object methods such as `Path.glob()` can\nimprove readability over their low-level counterparts (e.g.,\n`glob.glob()`).\n\nNote that `glob.glob()` and `Path.glob()` are not exact equivalents:\n\n|                   | `glob`-module functions                                                                                                                              | `Path.glob()`                                                                                                                                |\n|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|\n| Hidden files      | Hidden files are excluded by default. On Python 3.11+, the `include_hidden` keyword can be used to include hidden directories.                       | Includes hidden files by default.                                                                                                            |\n| Eagerness         | `glob.iglob()` returns a lazy iterator. Under the hood, `glob.glob()` simply converts the iterator to a list.                                        | `Path.glob()` returns a lazy iterator.                                                                                                       |\n| Working directory | `glob.glob()` and `glob.iglob()` take a `root_dir` keyword to set the current working directory.                                                     | `Path.rglob()` can be used to return the relative path.                                                                                      |\n| Globstar (`**`)   | The `recursive` flag must be set to `True` for the `**` pattern to match any files and zero or more directories, subdirectories, and symbolic links. | The `**` pattern in `Path.glob()` means \"this directory and all subdirectories, recursively\". In other words, it enables recursive globbing. |\n\n## Example\n```python\nimport glob\nimport os\n\nglob.glob(os.path.join(\"my_path\", \"requirements*.txt\"))\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(\"my_path\").glob(\"requirements*.txt\")\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.glob`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.glob)\n- [Python documentation: `Path.rglob`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.rglob)\n- [Python documentation: `glob.glob`](https://docs.python.org/3/library/glob.html#glob.glob)\n- [Python documentation: `glob.iglob`](https://docs.python.org/3/library/glob.html#glob.iglob)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "os-listdir",
    "code": "PTH208",
    "explanation": "## What it does\nChecks for uses of `os.listdir`.\n\n## Why is this bad?\n`pathlib` offers a high-level API for path manipulation, as compared to\nthe lower-level API offered by `os`. When possible, using `pathlib`'s\n`Path.iterdir()` can improve readability over `os.listdir()`.\n\n## Example\n\n```python\np = \".\"\nfor d in os.listdir(p):\n    ...\n\nif os.listdir(p):\n    ...\n\nif \"file\" in os.listdir(p):\n    ...\n```\n\nUse instead:\n\n```python\np = Path(\".\")\nfor d in p.iterdir():\n    ...\n\nif any(p.iterdir()):\n    ...\n\nif (p / \"file\").exists():\n    ...\n```\n\n## Known issues\nWhile using `pathlib` can improve the readability and type safety of your code,\nit can be less performant than the lower-level alternatives that work directly with strings,\nespecially on older versions of Python.\n\n## References\n- [Python documentation: `Path.iterdir`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.iterdir)\n- [Python documentation: `os.listdir`](https://docs.python.org/3/library/os.html#os.listdir)\n- [PEP 428 \u2013 The pathlib module \u2013 object-oriented filesystem paths](https://peps.python.org/pep-0428/)\n- [Correspondence between `os` and `pathlib`](https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module)\n- [Why you should be using pathlib](https://treyhunner.com/2018/12/why-you-should-be-using-pathlib/)\n- [No really, pathlib is great](https://treyhunner.com/2019/01/no-really-pathlib-is-great/)\n"
  },
  {
    "name": "invalid-pathlib-with-suffix",
    "code": "PTH210",
    "explanation": "## What it does\nChecks for `pathlib.Path.with_suffix()` calls where\nthe given suffix does not have a leading dot\nor the given suffix is a single dot `\".\"`.\n\n## Why is this bad?\n`Path.with_suffix()` will raise an error at runtime\nif the given suffix is not prefixed with a dot\nor it is a single dot `\".\"`.\n\n## Example\n\n```python\npath.with_suffix(\"py\")\n```\n\nUse instead:\n\n```python\npath.with_suffix(\".py\")\n```\n\n## Known problems\nThis rule is likely to have false negatives, as Ruff can only emit the\nlint if it can say for sure that a binding refers to a `Path` object at\nruntime. Due to type inference limitations, Ruff is currently only\nconfident about this if it can see that the binding originates from a\nfunction parameter annotated with `Path` or from a direct assignment to a\n`Path()` constructor call.\n\n## Fix safety\nThe fix for this rule adds a leading period to the string passed\nto the `with_suffix()` call. This fix is marked as unsafe, as it\nchanges runtime behaviour: the call would previously always have\nraised an exception, but no longer will.\n\nMoreover, it's impossible to determine if this is the correct fix\nfor a given situation (it's possible that the string was correct\nbut was being passed to the wrong method entirely, for example).\n\nNo fix is offered if the suffix `\".\"` is given, since the intent is unclear.\n",
    "fix": 1
  },
  {
    "name": "static-join-to-f-string",
    "code": "FLY002",
    "explanation": "## What it does\nChecks for `str.join` calls that can be replaced with f-strings.\n\n## Why is this bad?\nf-strings are more readable and generally preferred over `str.join` calls.\n\n## Example\n```python\n\" \".join((foo, bar))\n```\n\nUse instead:\n```python\nf\"{foo} {bar}\"\n```\n\n## References\n- [Python documentation: f-strings](https://docs.python.org/3/reference/lexical_analysis.html#f-strings)\n",
    "fix": 2
  },
  {
    "name": "unsorted-imports",
    "code": "I001",
    "explanation": "## What it does\nDe-duplicates, groups, and sorts imports based on the provided `isort` settings.\n\n## Why is this bad?\nConsistency is good. Use a common convention for imports to make your code\nmore readable and idiomatic.\n\n## Example\n```python\nimport pandas\nimport numpy as np\n```\n\nUse instead:\n```python\nimport numpy as np\nimport pandas\n```\n",
    "fix": 1
  },
  {
    "name": "missing-required-import",
    "code": "I002",
    "explanation": "## What it does\nAdds any required imports, as specified by the user, to the top of the\nfile.\n\n## Why is this bad?\nIn some projects, certain imports are required to be present in all\nfiles. For example, some projects assume that\n`from __future__ import annotations` is enabled,\nand thus require that import to be\npresent in all files. Omitting a \"required\" import (as specified by\nthe user) can cause errors or unexpected behavior.\n\n## Example\n```python\nimport typing\n```\n\nUse instead:\n```python\nfrom __future__ import annotations\n\nimport typing\n```\n\n## Options\n- `lint.isort.required-imports`\n",
    "fix": 2
  },
  {
    "name": "complex-structure",
    "code": "C901",
    "explanation": "## What it does\nChecks for functions with a high `McCabe` complexity.\n\n## Why is this bad?\nThe `McCabe` complexity of a function is a measure of the complexity of\nthe control flow graph of the function. It is calculated by adding\none to the number of decision points in the function. A decision\npoint is a place in the code where the program has a choice of two\nor more paths to follow.\n\nFunctions with a high complexity are hard to understand and maintain.\n\n## Example\n```python\ndef foo(a, b, c):\n    if a:\n        if b:\n            if c:\n                return 1\n            else:\n                return 2\n        else:\n            return 3\n    else:\n        return 4\n```\n\nUse instead:\n```python\ndef foo(a, b, c):\n    if not a:\n        return 4\n    if not b:\n        return 3\n    if not c:\n        return 2\n    return 1\n```\n\n## Options\n- `lint.mccabe.max-complexity`\n"
  },
  {
    "name": "numpy-deprecated-type-alias",
    "code": "NPY001",
    "explanation": "## What it does\nChecks for deprecated NumPy type aliases.\n\n## Why is this bad?\nNumPy's `np.int` has long been an alias of the builtin `int`; the same\nis true of `np.float` and others. These aliases exist primarily\nfor historic reasons, and have been a cause of frequent confusion\nfor newcomers.\n\nThese aliases were deprecated in 1.20, and removed in 1.24.\nNote, however, that `np.bool` and `np.long` were reintroduced in 2.0 with\ndifferent semantics, and are thus omitted from this rule.\n\n## Example\n```python\nimport numpy as np\n\nnp.int\n```\n\nUse instead:\n```python\nint\n```\n",
    "fix": 1
  },
  {
    "name": "numpy-legacy-random",
    "code": "NPY002",
    "explanation": "## What it does\nChecks for the use of legacy `np.random` function calls.\n\n## Why is this bad?\nAccording to the NumPy documentation's [Legacy Random Generation]:\n\n> The `RandomState` provides access to legacy generators... This class\n> should only be used if it is essential to have randoms that are\n> identical to what would have been produced by previous versions of\n> NumPy.\n\nThe members exposed directly on the `random` module are convenience\nfunctions that alias to methods on a global singleton `RandomState`\ninstance. NumPy recommends using a dedicated `Generator` instance\nrather than the random variate generation methods exposed directly on\nthe `random` module, as the new `Generator` is both faster and has\nbetter statistical properties.\n\nSee the documentation on [Random Sampling] and [NEP 19] for further\ndetails.\n\n## Example\n```python\nimport numpy as np\n\nnp.random.seed(1337)\nnp.random.normal()\n```\n\nUse instead:\n```python\nrng = np.random.default_rng(1337)\nrng.normal()\n```\n\n[Legacy Random Generation]: https://numpy.org/doc/stable/reference/random/legacy.html#legacy\n[Random Sampling]: https://numpy.org/doc/stable/reference/random/index.html#random-quick-start\n[NEP 19]: https://numpy.org/neps/nep-0019-rng-policy.html\n"
  },
  {
    "name": "numpy-deprecated-function",
    "code": "NPY003",
    "explanation": "## What it does\nChecks for uses of deprecated NumPy functions.\n\n## Why is this bad?\nWhen NumPy functions are deprecated, they are usually replaced with\nnewer, more efficient versions, or with functions that are more\nconsistent with the rest of the NumPy API.\n\nPrefer newer APIs over deprecated ones.\n\n## Example\n```python\nimport numpy as np\n\nnp.alltrue([True, False])\n```\n\nUse instead:\n```python\nimport numpy as np\n\nnp.all([True, False])\n```\n",
    "fix": 1
  },
  {
    "name": "numpy2-deprecation",
    "code": "NPY201",
    "explanation": "## What it does\nChecks for uses of NumPy functions and constants that were removed from\nthe main namespace in NumPy 2.0.\n\n## Why is this bad?\nNumPy 2.0 includes an overhaul of NumPy's Python API, intended to remove\nredundant aliases and routines, and establish unambiguous mechanisms for\naccessing constants, dtypes, and functions.\n\nAs part of this overhaul, a variety of deprecated NumPy functions and\nconstants were removed from the main namespace.\n\nThe majority of these functions and constants can be automatically replaced\nby other members of the NumPy API or by equivalents from the Python\nstandard library. With the exception of renaming `numpy.byte_bounds` to\n`numpy.lib.array_utils.byte_bounds`, all such replacements are backwards\ncompatible with earlier versions of NumPy.\n\nThis rule flags all uses of removed members, along with automatic fixes for\nany backwards-compatible replacements.\n\n## Example\n```python\nimport numpy as np\n\narr1 = [np.Infinity, np.NaN, np.nan, np.PINF, np.inf]\narr2 = [np.float_(1.5), np.float64(5.1)]\nnp.round_(arr2)\n```\n\nUse instead:\n```python\nimport numpy as np\n\narr1 = [np.inf, np.nan, np.nan, np.inf, np.inf]\narr2 = [np.float64(1.5), np.float64(5.1)]\nnp.round(arr2)\n```\n",
    "fix": 1
  },
  {
    "name": "invalid-class-name",
    "code": "N801",
    "explanation": "## What it does\nChecks for class names that do not follow the `CamelCase` convention.\n\n## Why is this bad?\n[PEP 8] recommends the use of the `CapWords` (or `CamelCase`) convention\nfor class names:\n\n> Class names should normally use the `CapWords` convention.\n>\n> The naming convention for functions may be used instead in cases where the interface is\n> documented and used primarily as a callable.\n>\n> Note that there is a separate convention for builtin names: most builtin names are single\n> words (or two words run together), with the `CapWords` convention used only for exception\n> names and builtin constants.\n\n## Example\n```python\nclass my_class:\n    pass\n```\n\nUse instead:\n```python\nclass MyClass:\n    pass\n```\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/#class-names\n"
  },
  {
    "name": "invalid-function-name",
    "code": "N802",
    "explanation": "## What it does\nChecks for functions names that do not follow the `snake_case` naming\nconvention.\n\n## Why is this bad?\n[PEP 8] recommends that function names follow `snake_case`:\n\n> Function names should be lowercase, with words separated by underscores as necessary to\n> improve readability. mixedCase is allowed only in contexts where that\u2019s already the\n> prevailing style (e.g. threading.py), to retain backwards compatibility.\n\nNames can be excluded from this rule using the [`lint.pep8-naming.ignore-names`]\nor [`lint.pep8-naming.extend-ignore-names`] configuration options. For example,\nto ignore all functions starting with `test_` from this rule, set the\n[`lint.pep8-naming.extend-ignore-names`] option to `[\"test_*\"]`.\n\n## Example\n```python\ndef myFunction():\n    pass\n```\n\nUse instead:\n```python\ndef my_function():\n    pass\n```\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/#function-and-variable-names\n"
  },
  {
    "name": "invalid-argument-name",
    "code": "N803",
    "explanation": "## What it does\nChecks for argument names that do not follow the `snake_case` convention.\n\n## Why is this bad?\n[PEP 8] recommends that function names should be lower case and separated\nby underscores (also known as `snake_case`).\n\n> Function names should be lowercase, with words separated by underscores\n> as necessary to improve readability.\n>\n> Variable names follow the same convention as function names.\n>\n> mixedCase is allowed only in contexts where that\u2019s already the\n> prevailing style (e.g. threading.py), to retain backwards compatibility.\n\nMethods decorated with `@typing.override` are ignored.\n\n## Example\n```python\ndef my_function(A, myArg):\n    pass\n```\n\nUse instead:\n```python\ndef my_function(a, my_arg):\n    pass\n```\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/#function-and-method-arguments\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "invalid-first-argument-name-for-class-method",
    "code": "N804",
    "explanation": "## What it does\nChecks for class methods that use a name other than `cls` for their\nfirst argument.\n\nThe method `__new__` is exempted from this\ncheck and the corresponding violation is caught by\n[`bad-staticmethod-argument`][PLW0211].\n\n## Why is this bad?\n[PEP 8] recommends the use of `cls` as the first argument for all class\nmethods:\n\n> Always use `cls` for the first argument to class methods.\n>\n> If a function argument\u2019s name clashes with a reserved keyword, it is generally better to\n> append a single trailing underscore rather than use an abbreviation or spelling corruption.\n> Thus `class_` is better than `clss`. (Perhaps better is to avoid such clashes by using a synonym.)\n\nNames can be excluded from this rule using the [`lint.pep8-naming.ignore-names`]\nor [`lint.pep8-naming.extend-ignore-names`] configuration options. For example,\nto allow the use of `klass` as the first argument to class methods, set\nthe [`lint.pep8-naming.extend-ignore-names`] option to `[\"klass\"]`.\n\n## Example\n\n```python\nclass Example:\n    @classmethod\n    def function(self, data): ...\n```\n\nUse instead:\n\n```python\nclass Example:\n    @classmethod\n    def function(cls, data): ...\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as renaming a method parameter\ncan change the behavior of the program.\n\n## Options\n- `lint.pep8-naming.classmethod-decorators`\n- `lint.pep8-naming.staticmethod-decorators`\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/#function-and-method-arguments\n[PLW0211]: https://docs.astral.sh/ruff/rules/bad-staticmethod-argument/\n",
    "fix": 1
  },
  {
    "name": "invalid-first-argument-name-for-method",
    "code": "N805",
    "explanation": "## What it does\nChecks for instance methods that use a name other than `self` for their\nfirst argument.\n\n## Why is this bad?\n[PEP 8] recommends the use of `self` as first argument for all instance\nmethods:\n\n> Always use self for the first argument to instance methods.\n>\n> If a function argument\u2019s name clashes with a reserved keyword, it is generally better to\n> append a single trailing underscore rather than use an abbreviation or spelling corruption.\n> Thus `class_` is better than `clss`. (Perhaps better is to avoid such clashes by using a synonym.)\n\nNames can be excluded from this rule using the [`lint.pep8-naming.ignore-names`]\nor [`lint.pep8-naming.extend-ignore-names`] configuration options. For example,\nto allow the use of `this` as the first argument to instance methods, set\nthe [`lint.pep8-naming.extend-ignore-names`] option to `[\"this\"]`.\n\n## Example\n\n```python\nclass Example:\n    def function(cls, data): ...\n```\n\nUse instead:\n\n```python\nclass Example:\n    def function(self, data): ...\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as renaming a method parameter\ncan change the behavior of the program.\n\n## Options\n- `lint.pep8-naming.classmethod-decorators`\n- `lint.pep8-naming.staticmethod-decorators`\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/#function-and-method-arguments\n",
    "fix": 1
  },
  {
    "name": "non-lowercase-variable-in-function",
    "code": "N806",
    "explanation": "## What it does\nChecks for the use of non-lowercase variable names in functions.\n\n## Why is this bad?\n[PEP 8] recommends that all function variables use lowercase names:\n\n> Function names should be lowercase, with words separated by underscores as necessary to\n> improve readability. Variable names follow the same convention as function names. mixedCase\n> is allowed only in contexts where that's already the prevailing style (e.g. threading.py),\n> to retain backwards compatibility.\n\n## Example\n```python\ndef my_function(a):\n    B = a + 3\n    return B\n```\n\nUse instead:\n```python\ndef my_function(a):\n    b = a + 3\n    return b\n```\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/#function-and-variable-names\n"
  },
  {
    "name": "dunder-function-name",
    "code": "N807",
    "explanation": "## What it does\nChecks for functions with \"dunder\" names (that is, names with two\nleading and trailing underscores) that are not documented.\n\n## Why is this bad?\n[PEP 8] recommends that only documented \"dunder\" methods are used:\n\n> ...\"magic\" objects or attributes that live in user-controlled\n> namespaces. E.g. `__init__`, `__import__` or `__file__`. Never invent\n> such names; only use them as documented.\n\n## Example\n```python\ndef __my_function__():\n    pass\n```\n\nUse instead:\n```python\ndef my_function():\n    pass\n```\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/\n"
  },
  {
    "name": "constant-imported-as-non-constant",
    "code": "N811",
    "explanation": "## What it does\nChecks for constant imports that are aliased to non-constant-style\nnames.\n\n## Why is this bad?\n[PEP 8] recommends naming conventions for classes, functions,\nconstants, and more. The use of inconsistent naming styles between\nimport and alias names may lead readers to expect an import to be of\nanother type (e.g., confuse a Python class with a constant).\n\nImport aliases should thus follow the same naming style as the member\nbeing imported.\n\n## Example\n```python\nfrom example import CONSTANT_VALUE as ConstantValue\n```\n\nUse instead:\n```python\nfrom example import CONSTANT_VALUE\n```\n\n## Note\nIdentifiers consisting of a single uppercase character are ambiguous under\nthe rules of [PEP 8], which specifies `CamelCase` for classes and\n`ALL_CAPS_SNAKE_CASE` for constants. Without a second character, it is not\npossible to reliably guess whether the identifier is intended to be part\nof a `CamelCase` string for a class or an `ALL_CAPS_SNAKE_CASE` string for\na constant, since both conventions will produce the same output when given\na single input character. Therefore, this lint rule does not apply to cases\nwhere the imported identifier consists of a single uppercase character.\n\nA common example of a single uppercase character being used for a class\nname can be found in Django's `django.db.models.Q` class.\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/\n"
  },
  {
    "name": "lowercase-imported-as-non-lowercase",
    "code": "N812",
    "explanation": "## What it does\nChecks for lowercase imports that are aliased to non-lowercase names.\n\n## Why is this bad?\n[PEP 8] recommends naming conventions for classes, functions,\nconstants, and more. The use of inconsistent naming styles between\nimport and alias names may lead readers to expect an import to be of\nanother type (e.g., confuse a Python class with a constant).\n\nImport aliases should thus follow the same naming style as the member\nbeing imported.\n\n## Example\n```python\nfrom example import myclassname as MyClassName\n```\n\nUse instead:\n```python\nfrom example import myclassname\n```\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/\n"
  },
  {
    "name": "camelcase-imported-as-lowercase",
    "code": "N813",
    "explanation": "## What it does\nChecks for `CamelCase` imports that are aliased to lowercase names.\n\n## Why is this bad?\n[PEP 8] recommends naming conventions for classes, functions,\nconstants, and more. The use of inconsistent naming styles between\nimport and alias names may lead readers to expect an import to be of\nanother type (e.g., confuse a Python class with a constant).\n\nImport aliases should thus follow the same naming style as the member\nbeing imported.\n\n## Example\n```python\nfrom example import MyClassName as myclassname\n```\n\nUse instead:\n```python\nfrom example import MyClassName\n```\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/\n"
  },
  {
    "name": "camelcase-imported-as-constant",
    "code": "N814",
    "explanation": "## What it does\nChecks for `CamelCase` imports that are aliased to constant-style names.\n\n## Why is this bad?\n[PEP 8] recommends naming conventions for classes, functions,\nconstants, and more. The use of inconsistent naming styles between\nimport and alias names may lead readers to expect an import to be of\nanother type (e.g., confuse a Python class with a constant).\n\nImport aliases should thus follow the same naming style as the member\nbeing imported.\n\n## Example\n```python\nfrom example import MyClassName as MY_CLASS_NAME\n```\n\nUse instead:\n```python\nfrom example import MyClassName\n```\n\n## Note\nIdentifiers consisting of a single uppercase character are ambiguous under\nthe rules of [PEP 8], which specifies `CamelCase` for classes and\n`ALL_CAPS_SNAKE_CASE` for constants. Without a second character, it is not\npossible to reliably guess whether the identifier is intended to be part\nof a `CamelCase` string for a class or an `ALL_CAPS_SNAKE_CASE` string for\na constant, since both conventions will produce the same output when given\na single input character. Therefore, this lint rule does not apply to cases\nwhere the alias for the imported identifier consists of a single uppercase\ncharacter.\n\nA common example of a single uppercase character being used for a class\nname can be found in Django's `django.db.models.Q` class.\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/\n"
  },
  {
    "name": "mixed-case-variable-in-class-scope",
    "code": "N815",
    "explanation": "## What it does\nChecks for class variable names that follow the `mixedCase` convention.\n\n## Why is this bad?\n[PEP 8] recommends that variable names should be lower case and separated\nby underscores (also known as `snake_case`).\n\n> Function names should be lowercase, with words separated by underscores\n> as necessary to improve readability.\n>\n> Variable names follow the same convention as function names.\n>\n> mixedCase is allowed only in contexts where that\u2019s already the\n> prevailing style (e.g. threading.py), to retain backwards compatibility.\n\n## Example\n```python\nclass MyClass:\n    myVariable = \"hello\"\n    another_variable = \"world\"\n```\n\nUse instead:\n```python\nclass MyClass:\n    my_variable = \"hello\"\n    another_variable = \"world\"\n```\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/#function-and-method-arguments\n"
  },
  {
    "name": "mixed-case-variable-in-global-scope",
    "code": "N816",
    "explanation": "## What it does\nChecks for global variable names that follow the `mixedCase` convention.\n\n## Why is this bad?\n[PEP 8] recommends that global variable names should be lower case and\nseparated by underscores (also known as `snake_case`).\n\n> ### Global Variable Names\n> (Let\u2019s hope that these variables are meant for use inside one module\n> only.) The conventions are about the same as those for functions.\n>\n> Modules that are designed for use via from M import * should use the\n> __all__ mechanism to prevent exporting globals, or use the older\n> convention of prefixing such globals with an underscore (which you might\n> want to do to indicate these globals are \u201cmodule non-public\u201d).\n>\n> ### Function and Variable Names\n> Function names should be lowercase, with words separated by underscores\n> as necessary to improve readability.\n>\n> Variable names follow the same convention as function names.\n>\n> mixedCase is allowed only in contexts where that\u2019s already the prevailing\n> style (e.g. threading.py), to retain backwards compatibility.\n\n## Example\n```python\nmyVariable = \"hello\"\nanother_variable = \"world\"\nyet_anotherVariable = \"foo\"\n```\n\nUse instead:\n```python\nmy_variable = \"hello\"\nanother_variable = \"world\"\nyet_another_variable = \"foo\"\n```\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/#global-variable-names\n"
  },
  {
    "name": "camelcase-imported-as-acronym",
    "code": "N817",
    "explanation": "## What it does\nChecks for `CamelCase` imports that are aliased as acronyms.\n\n## Why is this bad?\n[PEP 8] recommends naming conventions for classes, functions,\nconstants, and more. The use of inconsistent naming styles between\nimport and alias names may lead readers to expect an import to be of\nanother type (e.g., confuse a Python class with a constant).\n\nImport aliases should thus follow the same naming style as the member\nbeing imported.\n\nNote that this rule is distinct from `camelcase-imported-as-constant`\nto accommodate selective enforcement.\n\nAlso note that import aliases following an import convention according to the\n[`lint.flake8-import-conventions.aliases`] option are allowed.\n\n## Example\n```python\nfrom example import MyClassName as MCN\n```\n\nUse instead:\n```python\nfrom example import MyClassName\n```\n\n## Options\n- `lint.flake8-import-conventions.aliases`\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/\n"
  },
  {
    "name": "error-suffix-on-exception-name",
    "code": "N818",
    "explanation": "## What it does\nChecks for custom exception definitions that omit the `Error` suffix.\n\n## Why is this bad?\nThe `Error` suffix is recommended by [PEP 8]:\n\n> Because exceptions should be classes, the class naming convention\n> applies here. However, you should use the suffix `\"Error\"` on your\n> exception names (if the exception actually is an error).\n\n## Example\n\n```python\nclass Validation(Exception): ...\n```\n\nUse instead:\n\n```python\nclass ValidationError(Exception): ...\n```\n\n## Options\n- `lint.pep8-naming.ignore-names`\n- `lint.pep8-naming.extend-ignore-names`\n\n[PEP 8]: https://peps.python.org/pep-0008/#exception-names\n"
  },
  {
    "name": "invalid-module-name",
    "code": "N999",
    "explanation": "## What it does\nChecks for module names that do not follow the `snake_case` naming\nconvention or are otherwise invalid.\n\n## Why is this bad?\n[PEP 8] recommends the use of the `snake_case` naming convention for\nmodule names:\n\n> Modules should have short, all-lowercase names. Underscores can be used in the\n> module name if it improves readability. Python packages should also have short,\n> all-lowercase names, although the use of underscores is discouraged.\n>\n> When an extension module written in C or C++ has an accompanying Python module that\n> provides a higher level (e.g. more object-oriented) interface, the C/C++ module has\n> a leading underscore (e.g. `_socket`).\n\nFurther, in order for Python modules to be importable, they must be valid\nidentifiers. As such, they cannot start with a digit, or collide with hard\nkeywords, like `import` or `class`.\n\n## Example\n- Instead of `example-module-name` or `example module name`, use `example_module_name`.\n- Instead of `ExampleModule`, use `example_module`.\n\n[PEP 8]: https://peps.python.org/pep-0008/#package-and-module-names\n"
  },
  {
    "name": "pandas-use-of-inplace-argument",
    "code": "PD002",
    "explanation": "## What it does\nChecks for `inplace=True` usages in `pandas` function and method\ncalls.\n\n## Why is this bad?\nUsing `inplace=True` encourages mutation rather than immutable data,\nwhich is harder to reason about and may cause bugs. It also removes the\nability to use the method chaining style for `pandas` operations.\n\nFurther, in many cases, `inplace=True` does not provide a performance\nbenefit, as `pandas` will often copy `DataFrames` in the background.\n\n## Example\n```python\ndf.sort_values(\"col1\", inplace=True)\n```\n\nUse instead:\n```python\nsorted_df = df.sort_values(\"col1\")\n```\n\n## References\n- [_Why You Should Probably Never Use pandas `inplace=True`_](https://towardsdatascience.com/why-you-should-probably-never-use-pandas-inplace-true-9f9f211849e4)\n",
    "fix": 1
  },
  {
    "name": "pandas-use-of-dot-is-null",
    "code": "PD003",
    "explanation": "## What it does\nChecks for uses of `.isnull` on Pandas objects.\n\n## Why is this bad?\nIn the Pandas API, `.isna` and `.isnull` are equivalent. For consistency,\nprefer `.isna` over `.isnull`.\n\nAs a name, `.isna` more accurately reflects the behavior of the method,\nsince these methods check for `NaN` and `NaT` values in addition to `None`\nvalues.\n\n## Example\n```python\nimport pandas as pd\n\nanimals_df = pd.read_csv(\"animals.csv\")\npd.isnull(animals_df)\n```\n\nUse instead:\n```python\nimport pandas as pd\n\nanimals_df = pd.read_csv(\"animals.csv\")\npd.isna(animals_df)\n```\n\n## References\n- [Pandas documentation: `isnull`](https://pandas.pydata.org/docs/reference/api/pandas.isnull.html#pandas.isnull)\n- [Pandas documentation: `isna`](https://pandas.pydata.org/docs/reference/api/pandas.isna.html#pandas.isna)\n"
  },
  {
    "name": "pandas-use-of-dot-not-null",
    "code": "PD004",
    "explanation": "## What it does\nChecks for uses of `.notnull` on Pandas objects.\n\n## Why is this bad?\nIn the Pandas API, `.notna` and `.notnull` are equivalent. For consistency,\nprefer `.notna` over `.notnull`.\n\nAs a name, `.notna` more accurately reflects the behavior of the method,\nsince these methods check for `NaN` and `NaT` values in addition to `None`\nvalues.\n\n## Example\n```python\nimport pandas as pd\n\nanimals_df = pd.read_csv(\"animals.csv\")\npd.notnull(animals_df)\n```\n\nUse instead:\n```python\nimport pandas as pd\n\nanimals_df = pd.read_csv(\"animals.csv\")\npd.notna(animals_df)\n```\n\n## References\n- [Pandas documentation: `notnull`](https://pandas.pydata.org/docs/reference/api/pandas.notnull.html#pandas.notnull)\n- [Pandas documentation: `notna`](https://pandas.pydata.org/docs/reference/api/pandas.notna.html#pandas.notna)\n"
  },
  {
    "name": "pandas-use-of-dot-ix",
    "code": "PD007",
    "explanation": "## What it does\nChecks for uses of `.ix` on Pandas objects.\n\n## Why is this bad?\nThe `.ix` method is deprecated as its behavior is ambiguous. Specifically,\nit's often unclear whether `.ix` is indexing by label or by ordinal position.\n\nInstead, prefer the `.loc` method for label-based indexing, and `.iloc` for\nordinal indexing.\n\n## Example\n```python\nimport pandas as pd\n\nstudents_df = pd.read_csv(\"students.csv\")\nstudents_df.ix[0]  # 0th row or row with label 0?\n```\n\nUse instead:\n```python\nimport pandas as pd\n\nstudents_df = pd.read_csv(\"students.csv\")\nstudents_df.iloc[0]  # 0th row.\n```\n\n## References\n- [Pandas release notes: Deprecate `.ix`](https://pandas.pydata.org/pandas-docs/version/0.20/whatsnew.html#deprecate-ix)\n- [Pandas documentation: `loc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)\n- [Pandas documentation: `iloc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iloc.html)\n"
  },
  {
    "name": "pandas-use-of-dot-at",
    "code": "PD008",
    "explanation": "## What it does\nChecks for uses of `.at` on Pandas objects.\n\n## Why is this bad?\nThe `.at` method selects a single value from a `DataFrame` or Series based on\na label index, and is slightly faster than using `.loc`. However, `.loc` is\nmore idiomatic and versatile, as it can be used to select multiple values at\nonce.\n\nIf performance is an important consideration, convert the object to a NumPy\narray, which will provide a much greater performance boost than using `.at`\nover `.loc`.\n\n## Example\n```python\nimport pandas as pd\n\nstudents_df = pd.read_csv(\"students.csv\")\nstudents_df.at[\"Maria\"]\n```\n\nUse instead:\n```python\nimport pandas as pd\n\nstudents_df = pd.read_csv(\"students.csv\")\nstudents_df.loc[\"Maria\"]\n```\n\n## References\n- [Pandas documentation: `loc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)\n- [Pandas documentation: `at`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.at.html)\n"
  },
  {
    "name": "pandas-use-of-dot-iat",
    "code": "PD009",
    "explanation": "## What it does\nChecks for uses of `.iat` on Pandas objects.\n\n## Why is this bad?\nThe `.iat` method selects a single value from a `DataFrame` or Series based\non an ordinal index, and is slightly faster than using `.iloc`. However,\n`.iloc` is more idiomatic and versatile, as it can be used to select\nmultiple values at once.\n\nIf performance is an important consideration, convert the object to a NumPy\narray, which will provide a much greater performance boost than using `.iat`\nover `.iloc`.\n\n## Example\n```python\nimport pandas as pd\n\nstudents_df = pd.read_csv(\"students.csv\")\nstudents_df.iat[0]\n```\n\nUse instead:\n```python\nimport pandas as pd\n\nstudents_df = pd.read_csv(\"students.csv\")\nstudents_df.iloc[0]\n```\n\nOr, using NumPy:\n```python\nimport numpy as np\nimport pandas as pd\n\nstudents_df = pd.read_csv(\"students.csv\")\nstudents_df.to_numpy()[0]\n```\n\n## References\n- [Pandas documentation: `iloc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iloc.html)\n- [Pandas documentation: `iat`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.iat.html)\n"
  },
  {
    "name": "pandas-use-of-dot-pivot-or-unstack",
    "code": "PD010",
    "explanation": "## What it does\nChecks for uses of `.pivot` or `.unstack` on Pandas objects.\n\n## Why is this bad?\nPrefer `.pivot_table` to `.pivot` or `.unstack`. `.pivot_table` is more general\nand can be used to implement the same behavior as `.pivot` and `.unstack`.\n\n## Example\n```python\nimport pandas as pd\n\ndf = pd.read_csv(\"cities.csv\")\ndf.pivot(index=\"city\", columns=\"year\", values=\"population\")\n```\n\nUse instead:\n```python\nimport pandas as pd\n\ndf = pd.read_csv(\"cities.csv\")\ndf.pivot_table(index=\"city\", columns=\"year\", values=\"population\")\n```\n\n## References\n- [Pandas documentation: Reshaping and pivot tables](https://pandas.pydata.org/docs/user_guide/reshaping.html)\n- [Pandas documentation: `pivot_table`](https://pandas.pydata.org/docs/reference/api/pandas.pivot_table.html#pandas.pivot_table)\n"
  },
  {
    "name": "pandas-use-of-dot-values",
    "code": "PD011",
    "explanation": "## What it does\nChecks for uses of `.values` on Pandas Series and Index objects.\n\n## Why is this bad?\nThe `.values` attribute is ambiguous as its return type is unclear. As\nsuch, it is no longer recommended by the Pandas documentation.\n\nInstead, use `.to_numpy()` to return a NumPy array, or `.array` to return a\nPandas `ExtensionArray`.\n\n## Example\n```python\nimport pandas as pd\n\nanimals = pd.read_csv(\"animals.csv\").values  # Ambiguous.\n```\n\nUse instead:\n```python\nimport pandas as pd\n\nanimals = pd.read_csv(\"animals.csv\").to_numpy()  # Explicit.\n```\n\n## References\n- [Pandas documentation: Accessing the values in a Series or Index](https://pandas.pydata.org/pandas-docs/stable/whatsnew/v0.24.0.html#accessing-the-values-in-a-series-or-index)\n"
  },
  {
    "name": "pandas-use-of-dot-read-table",
    "code": "PD012",
    "explanation": "## What it does\nChecks for uses of `pd.read_table` to read CSV files.\n\n## Why is this bad?\nIn the Pandas API, `pd.read_csv` and `pd.read_table` are equivalent apart\nfrom their default separator: `pd.read_csv` defaults to a comma (`,`),\nwhile `pd.read_table` defaults to a tab (`\\t`) as the default separator.\n\nPrefer `pd.read_csv` over `pd.read_table` when reading comma-separated\ndata (like CSV files), as it is more idiomatic.\n\n## Example\n```python\nimport pandas as pd\n\ncities_df = pd.read_table(\"cities.csv\", sep=\",\")\n```\n\nUse instead:\n```python\nimport pandas as pd\n\ncities_df = pd.read_csv(\"cities.csv\")\n```\n\n## References\n- [Pandas documentation: `read_csv`](https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html#pandas.read_csv)\n- [Pandas documentation: `read_table`](https://pandas.pydata.org/docs/reference/api/pandas.read_table.html#pandas.read_table)\n"
  },
  {
    "name": "pandas-use-of-dot-stack",
    "code": "PD013",
    "explanation": "## What it does\nChecks for uses of `.stack` on Pandas objects.\n\n## Why is this bad?\nPrefer `.melt` to `.stack`, which has the same functionality but with\nsupport for direct column renaming and no dependence on `MultiIndex`.\n\n## Example\n```python\nimport pandas as pd\n\ncities_df = pd.read_csv(\"cities.csv\")\ncities_df.set_index(\"city\").stack()\n```\n\nUse instead:\n```python\nimport pandas as pd\n\ncities_df = pd.read_csv(\"cities.csv\")\ncities_df.melt(id_vars=\"city\")\n```\n\n## References\n- [Pandas documentation: `melt`](https://pandas.pydata.org/docs/reference/api/pandas.melt.html)\n- [Pandas documentation: `stack`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.stack.html)\n"
  },
  {
    "name": "pandas-use-of-pd-merge",
    "code": "PD015",
    "explanation": "## What it does\nChecks for uses of `pd.merge` on Pandas objects.\n\n## Why is this bad?\nIn Pandas, the `.merge` method (exposed on, e.g., `DataFrame` objects) and\nthe `pd.merge` function (exposed on the Pandas module) are equivalent.\n\nFor consistency, prefer calling `.merge` on an object over calling\n`pd.merge` on the Pandas module, as the former is more idiomatic.\n\nFurther, `pd.merge` is not a method, but a function, which prohibits it\nfrom being used in method chains, a common pattern in Pandas code.\n\n## Example\n```python\nimport pandas as pd\n\ncats_df = pd.read_csv(\"cats.csv\")\ndogs_df = pd.read_csv(\"dogs.csv\")\nrabbits_df = pd.read_csv(\"rabbits.csv\")\npets_df = pd.merge(pd.merge(cats_df, dogs_df), rabbits_df)  # Hard to read.\n```\n\nUse instead:\n```python\nimport pandas as pd\n\ncats_df = pd.read_csv(\"cats.csv\")\ndogs_df = pd.read_csv(\"dogs.csv\")\nrabbits_df = pd.read_csv(\"rabbits.csv\")\npets_df = cats_df.merge(dogs_df).merge(rabbits_df)\n```\n\n## References\n- [Pandas documentation: `merge`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html#pandas.DataFrame.merge)\n- [Pandas documentation: `pd.merge`](https://pandas.pydata.org/docs/reference/api/pandas.merge.html#pandas.merge)\n"
  },
  {
    "name": "pandas-nunique-constant-series-check",
    "code": "PD101",
    "explanation": "## What it does\nCheck for uses of `.nunique()` to check if a Pandas Series is constant\n(i.e., contains only one unique value).\n\n## Why is this bad?\n`.nunique()` is computationally inefficient for checking if a Series is\nconstant.\n\nConsider, for example, a Series of length `n` that consists of increasing\ninteger values (e.g., 1, 2, 3, 4). The `.nunique()` method will iterate\nover the entire Series to count the number of unique values. But in this\ncase, we can detect that the Series is non-constant after visiting the\nfirst two values, which are non-equal.\n\nIn general, `.nunique()` requires iterating over the entire Series, while a\nmore efficient approach allows short-circuiting the operation as soon as a\nnon-equal value is found.\n\nInstead of calling `.nunique()`, convert the Series to a NumPy array, and\ncheck if all values in the array are equal to the first observed value.\n\n## Example\n```python\nimport pandas as pd\n\ndata = pd.Series(range(1000))\nif data.nunique() <= 1:\n    print(\"Series is constant\")\n```\n\nUse instead:\n```python\nimport pandas as pd\n\ndata = pd.Series(range(1000))\narray = data.to_numpy()\nif array.shape[0] == 0 or (array[0] == array).all():\n    print(\"Series is constant\")\n```\n\n## References\n- [Pandas Cookbook: \"Constant Series\"](https://pandas.pydata.org/docs/user_guide/cookbook.html#constant-series)\n- [Pandas documentation: `nunique`](https://pandas.pydata.org/docs/reference/api/pandas.Series.nunique.html)\n"
  },
  {
    "name": "pandas-df-variable-name",
    "code": "PD901",
    "explanation": "## What it does\nChecks for assignments to the variable `df`.\n\n## Why is this bad?\nAlthough `df` is a common variable name for a Pandas `DataFrame`, it's not a\ngreat variable name for production code, as it's non-descriptive and\nprone to name conflicts.\n\nInstead, use a more descriptive variable name.\n\n## Example\n```python\nimport pandas as pd\n\ndf = pd.read_csv(\"animals.csv\")\n```\n\nUse instead:\n```python\nimport pandas as pd\n\nanimals = pd.read_csv(\"animals.csv\")\n```\n"
  },
  {
    "name": "unnecessary-list-cast",
    "code": "PERF101",
    "explanation": "## What it does\nChecks for explicit casts to `list` on for-loop iterables.\n\n## Why is this bad?\nUsing a `list()` call to eagerly iterate over an already-iterable type\n(like a tuple, list, or set) is inefficient, as it forces Python to create\na new list unnecessarily.\n\nRemoving the `list()` call will not change the behavior of the code, but\nmay improve performance.\n\nNote that, as with all `perflint` rules, this is only intended as a\nmicro-optimization, and will have a negligible impact on performance in\nmost cases.\n\n## Example\n```python\nitems = (1, 2, 3)\nfor i in list(items):\n    print(i)\n```\n\nUse instead:\n```python\nitems = (1, 2, 3)\nfor i in items:\n    print(i)\n```\n",
    "fix": 2
  },
  {
    "name": "incorrect-dict-iterator",
    "code": "PERF102",
    "explanation": "## What it does\nChecks for uses of `dict.items()` that discard either the key or the value\nwhen iterating over the dictionary.\n\n## Why is this bad?\nIf you only need the keys or values of a dictionary, you should use\n`dict.keys()` or `dict.values()` respectively, instead of `dict.items()`.\nThese specialized methods are more efficient than `dict.items()`, as they\navoid allocating tuples for every item in the dictionary. They also\ncommunicate the intent of the code more clearly.\n\nNote that, as with all `perflint` rules, this is only intended as a\nmicro-optimization, and will have a negligible impact on performance in\nmost cases.\n\n## Example\n```python\nobj = {\"a\": 1, \"b\": 2}\nfor key, value in obj.items():\n    print(value)\n```\n\nUse instead:\n```python\nobj = {\"a\": 1, \"b\": 2}\nfor value in obj.values():\n    print(value)\n```\n\n## Fix safety\nThe fix does not perform any type analysis and, as such, may suggest an\nincorrect fix if the object in question does not duck-type as a mapping\n(e.g., if it is missing a `.keys()` or `.values()` method, or if those\nmethods behave differently than they do on standard mapping types).\n",
    "fix": 2
  },
  {
    "name": "try-except-in-loop",
    "code": "PERF203",
    "explanation": "## What it does\nChecks for uses of except handling via `try`-`except` within `for` and\n`while` loops.\n\n## Why is this bad?\nException handling via `try`-`except` blocks incurs some performance\noverhead, regardless of whether an exception is raised.\n\nTo optimize your code, two techniques are possible:\n1. Refactor your code to put the entire loop into the `try`-`except` block,\n   rather than wrapping each iteration in a separate `try`-`except` block.\n2. Use \"Look Before You Leap\" idioms that attempt to avoid exceptions\n   being raised in the first place, avoiding the need to use `try`-`except`\n   blocks in the first place.\n\nThis rule is only enforced for Python versions prior to 3.11, which\nintroduced \"zero-cost\" exception handling. However, note that even on\nPython 3.11 and newer, refactoring your code to avoid exception handling in\ntight loops can provide a significant speedup in some cases, as zero-cost\nexception handling is only zero-cost in the \"happy path\" where no exception\nis raised in the `try`-`except` block.\n\nAs with all `perflint` rules, this is only intended as a\nmicro-optimization. In many cases, it will have a negligible impact on\nperformance.\n\n## Example\n```python\nstring_numbers: list[str] = [\"1\", \"2\", \"three\", \"4\", \"5\"]\n\n# `try`/`except` that could be moved out of the loop:\nint_numbers: list[int] = []\nfor num in string_numbers:\n    try:\n        int_numbers.append(int(num))\n    except ValueError as e:\n        print(f\"Couldn't convert to integer: {e}\")\n        break\n\n# `try`/`except` used when \"look before you leap\" idioms could be used:\nnumber_names: dict[int, str] = {1: \"one\", 3: \"three\", 4: \"four\"}\nfor number in range(5):\n    try:\n        name = number_names[number]\n    except KeyError:\n        continue\n    else:\n        print(f\"The name of {number} is {name}\")\n```\n\nUse instead:\n```python\nstring_numbers: list[str] = [\"1\", \"2\", \"three\", \"4\", \"5\"]\n\nint_numbers: list[int] = []\ntry:\n    for num in string_numbers:\n        int_numbers.append(int(num))\nexcept ValueError as e:\n    print(f\"Couldn't convert to integer: {e}\")\n\nnumber_names: dict[int, str] = {1: \"one\", 3: \"three\", 4: \"four\"}\nfor number in range(5):\n    name = number_names.get(number)\n    if name is not None:\n        print(f\"The name of {number} is {name}\")\n```\n\n## Options\n- `target-version`\n"
  },
  {
    "name": "manual-list-comprehension",
    "code": "PERF401",
    "explanation": "## What it does\nChecks for `for` loops that can be replaced by a list comprehension.\n\n## Why is this bad?\nWhen creating a transformed list from an existing list using a for-loop,\nprefer a list comprehension. List comprehensions are more readable and\nmore performant.\n\nUsing the below as an example, the list comprehension is ~10% faster on\nPython 3.11, and ~25% faster on Python 3.10.\n\nNote that, as with all `perflint` rules, this is only intended as a\nmicro-optimization, and will have a negligible impact on performance in\nmost cases.\n\n## Example\n```python\noriginal = list(range(10000))\nfiltered = []\nfor i in original:\n    if i % 2:\n        filtered.append(i)\n```\n\nUse instead:\n```python\noriginal = list(range(10000))\nfiltered = [x for x in original if x % 2]\n```\n\nIf you're appending to an existing list, use the `extend` method instead:\n```python\noriginal = list(range(10000))\nfiltered.extend(x for x in original if x % 2)\n```\n\nTake care that if the original for-loop uses an assignment expression\nas a conditional, such as `if match:=re.match(\"\\d+\",\"123\")`, then\nthe corresponding comprehension must wrap the assignment\nexpression in parentheses to avoid a syntax error.\n",
    "fix": 1
  },
  {
    "name": "manual-list-copy",
    "code": "PERF402",
    "explanation": "## What it does\nChecks for `for` loops that can be replaced by a making a copy of a list.\n\n## Why is this bad?\nWhen creating a copy of an existing list using a for-loop, prefer\n`list` or `list.copy` instead. Making a direct copy is more readable and\nmore performant.\n\nUsing the below as an example, the `list`-based copy is ~2x faster on\nPython 3.11.\n\nNote that, as with all `perflint` rules, this is only intended as a\nmicro-optimization, and will have a negligible impact on performance in\nmost cases.\n\n## Example\n```python\noriginal = list(range(10000))\nfiltered = []\nfor i in original:\n    filtered.append(i)\n```\n\nUse instead:\n```python\noriginal = list(range(10000))\nfiltered = list(original)\n```\n"
  },
  {
    "name": "manual-dict-comprehension",
    "code": "PERF403",
    "explanation": "## What it does\nChecks for `for` loops that can be replaced by a dictionary comprehension.\n\n## Why is this bad?\nWhen creating or extending a dictionary in a for-loop, prefer a dictionary\ncomprehension. Comprehensions are more readable and more performant.\n\nFor example, when comparing `{x: x for x in list(range(1000))}` to the `for`\nloop version, the comprehension is ~10% faster on Python 3.11.\n\nNote that, as with all `perflint` rules, this is only intended as a\nmicro-optimization, and will have a negligible impact on performance in\nmost cases.\n\n## Example\n```python\npairs = ((\"a\", 1), (\"b\", 2))\nresult = {}\nfor x, y in pairs:\n    if y % 2:\n        result[x] = y\n```\n\nUse instead:\n```python\npairs = ((\"a\", 1), (\"b\", 2))\nresult = {x: y for x, y in pairs if y % 2}\n```\n\nIf you're appending to an existing dictionary, use the `update` method instead:\n```python\npairs = ((\"a\", 1), (\"b\", 2))\nresult.update({x: y for x, y in pairs if y % 2})\n```\n"
  },
  {
    "name": "mixed-spaces-and-tabs",
    "code": "E101",
    "explanation": "## What it does\nChecks for mixed tabs and spaces in indentation.\n\n## Why is this bad?\nNever mix tabs and spaces.\n\nThe most popular way of indenting Python is with spaces only. The\nsecond-most popular way is with tabs only. Code indented with a\nmixture of tabs and spaces should be converted to using spaces\nexclusively.\n\n## Example\n```python\nif a == 0:\\n        a = 1\\n\\tb = 1\n```\n\nUse instead:\n```python\nif a == 0:\\n    a = 1\\n    b = 1\n```\n"
  },
  {
    "name": "indentation-with-invalid-multiple",
    "code": "E111",
    "explanation": "## What it does\nChecks for indentation with a non-multiple of 4 spaces.\n\n## Why is this bad?\nAccording to [PEP 8], 4 spaces per indentation level should be preferred.\n\n## Example\n```python\nif True:\n   a = 1\n```\n\nUse instead:\n```python\nif True:\n    a = 1\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent indentation, making the rule redundant.\n\nThe rule is also incompatible with the [formatter] when using\n`indent-width` with a value other than `4`.\n\n## Options\n- `indent-width`\n\n[PEP 8]: https://peps.python.org/pep-0008/#indentation\n[formatter]:https://docs.astral.sh/ruff/formatter/\n",
    "preview": true
  },
  {
    "name": "no-indented-block",
    "code": "E112",
    "explanation": "## What it does\nChecks for indented blocks that are lacking indentation.\n\n## Why is this bad?\nAll indented blocks should be indented; otherwise, they are not valid\nPython syntax.\n\n## Example\n```python\nfor item in items:\npass\n```\n\nUse instead:\n```python\nfor item in items:\n    pass\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#indentation\n",
    "preview": true
  },
  {
    "name": "unexpected-indentation",
    "code": "E113",
    "explanation": "## What it does\nChecks for unexpected indentation.\n\n## Why is this bad?\nIndentation outside of a code block is not valid Python syntax.\n\n## Example\n```python\na = 1\n    b = 2\n```\n\nUse instead:\n```python\na = 1\nb = 2\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#indentation\n",
    "preview": true
  },
  {
    "name": "indentation-with-invalid-multiple-comment",
    "code": "E114",
    "explanation": "## What it does\nChecks for indentation of comments with a non-multiple of 4 spaces.\n\n## Why is this bad?\nAccording to [PEP 8], 4 spaces per indentation level should be preferred.\n\n## Example\n```python\nif True:\n   # a = 1\n```\n\nUse instead:\n```python\nif True:\n    # a = 1\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent indentation, making the rule redundant.\n\nThe rule is also incompatible with the [formatter] when using\n`indent-width` with a value other than `4`.\n\n## Options\n- `indent-width`\n\n[PEP 8]: https://peps.python.org/pep-0008/#indentation\n[formatter]:https://docs.astral.sh/ruff/formatter/\n",
    "preview": true
  },
  {
    "name": "no-indented-block-comment",
    "code": "E115",
    "explanation": "## What it does\nChecks for comments in a code blocks that are lacking indentation.\n\n## Why is this bad?\nComments within an indented block should themselves be indented, to\nindicate that they are part of the block.\n\n## Example\n```python\nfor item in items:\n# Hi\n    pass\n```\n\nUse instead:\n```python\nfor item in items:\n    # Hi\n    pass\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#indentation\n",
    "preview": true
  },
  {
    "name": "unexpected-indentation-comment",
    "code": "E116",
    "explanation": "## What it does\nChecks for unexpected indentation of comment.\n\n## Why is this bad?\nComments should match the indentation of the containing code block.\n\n## Example\n```python\na = 1\n    # b = 2\n```\n\nUse instead:\n```python\na = 1\n# b = 2\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#indentation\n",
    "preview": true
  },
  {
    "name": "over-indented",
    "code": "E117",
    "explanation": "## What it does\nChecks for over-indented code.\n\n## Why is this bad?\nAccording to [PEP 8], 4 spaces per indentation level should be preferred. Increased\nindentation can lead to inconsistent formatting, which can hurt\nreadability.\n\n## Example\n```python\nfor item in items:\n      pass\n```\n\nUse instead:\n```python\nfor item in items:\n    pass\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent indentation, making the rule redundant.\n\n[PEP 8]: https://peps.python.org/pep-0008/#indentation\n[formatter]:https://docs.astral.sh/ruff/formatter/\n",
    "preview": true
  },
  {
    "name": "whitespace-after-open-bracket",
    "code": "E201",
    "explanation": "## What it does\nChecks for the use of extraneous whitespace after \"(\", \"[\" or \"{\".\n\n## Why is this bad?\n[PEP 8] recommends the omission of whitespace in the following cases:\n- \"Immediately inside parentheses, brackets or braces.\"\n- \"Immediately before a comma, semicolon, or colon.\"\n\n## Example\n```python\nspam( ham[1], {eggs: 2})\nspam(ham[ 1], {eggs: 2})\nspam(ham[1], { eggs: 2})\n```\n\nUse instead:\n```python\nspam(ham[1], {eggs: 2})\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "whitespace-before-close-bracket",
    "code": "E202",
    "explanation": "## What it does\nChecks for the use of extraneous whitespace before \")\", \"]\" or \"}\".\n\n## Why is this bad?\n[PEP 8] recommends the omission of whitespace in the following cases:\n- \"Immediately inside parentheses, brackets or braces.\"\n- \"Immediately before a comma, semicolon, or colon.\"\n\n## Example\n```python\nspam(ham[1], {eggs: 2} )\nspam(ham[1 ], {eggs: 2})\nspam(ham[1], {eggs: 2 })\n```\n\nUse instead:\n```python\nspam(ham[1], {eggs: 2})\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "whitespace-before-punctuation",
    "code": "E203",
    "explanation": "## What it does\nChecks for the use of extraneous whitespace before \",\", \";\" or \":\".\n\n## Why is this bad?\n[PEP 8] recommends the omission of whitespace in the following cases:\n- \"Immediately inside parentheses, brackets or braces.\"\n- \"Immediately before a comma, semicolon, or colon.\"\n\n## Example\n```python\nif x == 4: print(x, y); x, y = y , x\n```\n\nUse instead:\n```python\nif x == 4: print(x, y); x, y = y, x\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "whitespace-after-decorator",
    "code": "E204",
    "explanation": "## What it does\nChecks for trailing whitespace after a decorator's opening `@`.\n\n## Why is this bad?\nIncluding whitespace after the `@` symbol is not compliant with\n[PEP 8].\n\n## Example\n\n```python\n@ decorator\ndef func():\n   pass\n```\n\nUse instead:\n```python\n@decorator\ndef func():\n  pass\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#maximum-line-length\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "whitespace-before-parameters",
    "code": "E211",
    "explanation": "## What it does\nChecks for extraneous whitespace immediately preceding an open parenthesis\nor bracket.\n\n## Why is this bad?\nAccording to [PEP 8], open parentheses and brackets should not be preceded\nby any trailing whitespace.\n\n## Example\n```python\nspam (1)\n```\n\nUse instead:\n```python\nspam(1)\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "multiple-spaces-before-operator",
    "code": "E221",
    "explanation": "## What it does\nChecks for extraneous whitespace before an operator.\n\n## Why is this bad?\nAccording to [PEP 8], operators should be surrounded by at most a single space on either\nside.\n\n## Example\n```python\na = 4  + 5\n```\n\nUse instead:\n```python\na = 4 + 5\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "multiple-spaces-after-operator",
    "code": "E222",
    "explanation": "## What it does\nChecks for extraneous whitespace after an operator.\n\n## Why is this bad?\nAccording to [PEP 8], operators should be surrounded by at most a single space on either\nside.\n\n## Example\n```python\na = 4 +  5\n```\n\nUse instead:\n```python\na = 4 + 5\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "tab-before-operator",
    "code": "E223",
    "explanation": "## What it does\nChecks for extraneous tabs before an operator.\n\n## Why is this bad?\nAccording to [PEP 8], operators should be surrounded by at most a single space on either\nside.\n\n## Example\n```python\na = 4\\t+ 5\n```\n\nUse instead:\n```python\na = 4 + 5\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "tab-after-operator",
    "code": "E224",
    "explanation": "## What it does\nChecks for extraneous tabs after an operator.\n\n## Why is this bad?\nAccording to [PEP 8], operators should be surrounded by at most a single space on either\nside.\n\n## Example\n```python\na = 4 +\\t5\n```\n\nUse instead:\n```python\na = 4 + 5\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "missing-whitespace-around-operator",
    "code": "E225",
    "explanation": "## What it does\nChecks for missing whitespace around all operators.\n\n## Why is this bad?\nAccording to [PEP 8], there should be one space before and after all\noperators.\n\n## Example\n```python\nif number==42:\n    print('you have found the meaning of life')\n```\n\nUse instead:\n```python\nif number == 42:\n    print('you have found the meaning of life')\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "missing-whitespace-around-arithmetic-operator",
    "code": "E226",
    "explanation": "## What it does\nChecks for missing whitespace arithmetic operators.\n\n## Why is this bad?\nAccording to [PEP 8], there should be one space before and after an\narithmetic operator (+, -, /, and *).\n\n## Example\n```python\nnumber = 40+2\n```\n\nUse instead:\n```python\nnumber = 40 + 2\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "missing-whitespace-around-bitwise-or-shift-operator",
    "code": "E227",
    "explanation": "## What it does\nChecks for missing whitespace around bitwise and shift operators.\n\n## Why is this bad?\nAccording to [PEP 8], there should be one space before and after bitwise and\nshift operators (<<, >>, &, |, ^).\n\n## Example\n```python\nx = 128<<1\n```\n\nUse instead:\n```python\nx = 128 << 1\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#pet-peeves\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "missing-whitespace-around-modulo-operator",
    "code": "E228",
    "explanation": "## What it does\nChecks for missing whitespace around the modulo operator.\n\n## Why is this bad?\nAccording to [PEP 8], the modulo operator (%) should have whitespace on\neither side of it.\n\n## Example\n```python\nremainder = 10%2\n```\n\nUse instead:\n```python\nremainder = 10 % 2\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "missing-whitespace",
    "code": "E231",
    "explanation": "## What it does\nChecks for missing whitespace after `,`, `;`, and `:`.\n\n## Why is this bad?\nMissing whitespace after `,`, `;`, and `:` makes the code harder to read.\n\n## Example\n```python\na = (1,2)\n```\n\nUse instead:\n```python\na = (1, 2)\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "multiple-spaces-after-comma",
    "code": "E241",
    "explanation": "## What it does\nChecks for extraneous whitespace after a comma.\n\n## Why is this bad?\nConsistency is good. This rule helps ensure you have a consistent\nformatting style across your project.\n\n## Example\n```python\na = 4,    5\n```\n\nUse instead:\n```python\na = 4, 5\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "tab-after-comma",
    "code": "E242",
    "explanation": "## What it does\nChecks for extraneous tabs after a comma.\n\n## Why is this bad?\nCommas should be followed by one space, never tabs.\n\n## Example\n```python\na = 4,\\t5\n```\n\nUse instead:\n```python\na = 4, 5\n```\n\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "unexpected-spaces-around-keyword-parameter-equals",
    "code": "E251",
    "explanation": "## What it does\nChecks for missing whitespace around the equals sign in an unannotated\nfunction keyword parameter.\n\n## Why is this bad?\nAccording to [PEP 8], there should be no spaces around the equals sign in a\nkeyword parameter, if it is unannotated:\n\n> Don\u2019t use spaces around the = sign when used to indicate a keyword\n> argument, or when used to indicate a default value for an unannotated\n> function parameter.\n\n## Example\n```python\ndef add(a = 0) -> int:\n    return a + 1\n```\n\nUse instead:\n```python\ndef add(a=0) -> int:\n    return a + 1\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "missing-whitespace-around-parameter-equals",
    "code": "E252",
    "explanation": "## What it does\nChecks for missing whitespace around the equals sign in an annotated\nfunction keyword parameter.\n\n## Why is this bad?\nAccording to [PEP 8], the spaces around the equals sign in a keyword\nparameter should only be omitted when the parameter is unannotated:\n\n> Don\u2019t use spaces around the = sign when used to indicate a keyword\n> argument, or when used to indicate a default value for an unannotated\n> function parameter.\n\n## Example\n```python\ndef add(a: int=0) -> int:\n    return a + 1\n```\n\nUse instead:\n```python\ndef add(a: int = 0) -> int:\n    return a + 1\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#whitespace-in-expressions-and-statements\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "too-few-spaces-before-inline-comment",
    "code": "E261",
    "explanation": "## What it does\nChecks if inline comments are separated by at least two spaces.\n\n## Why is this bad?\nAn inline comment is a comment on the same line as a statement.\n\nPer [PEP 8], inline comments should be separated by at least two spaces from\nthe preceding statement.\n\n## Example\n```python\nx = x + 1 # Increment x\n```\n\nUse instead:\n```python\nx = x + 1  # Increment x\nx = x + 1    # Increment x\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#comments\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "no-space-after-inline-comment",
    "code": "E262",
    "explanation": "## What it does\nChecks if one space is used after inline comments.\n\n## Why is this bad?\nAn inline comment is a comment on the same line as a statement.\n\nPer [PEP 8], inline comments should start with a # and a single space.\n\n## Example\n```python\nx = x + 1  #Increment x\nx = x + 1  #  Increment x\nx = x + 1  # \\xa0Increment x\n```\n\nUse instead:\n```python\nx = x + 1  # Increment x\nx = x + 1    # Increment x\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#comments\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "no-space-after-block-comment",
    "code": "E265",
    "explanation": "## What it does\nChecks for block comments that lack a single space after the leading `#` character.\n\n## Why is this bad?\nPer [PEP 8], \"Block comments generally consist of one or more paragraphs built\nout of complete sentences, with each sentence ending in a period.\"\n\nBlock comments should start with a `#` followed by a single space.\n\nShebangs (lines starting with `#!`, at the top of a file) are exempt from this\nrule.\n\n## Example\n```python\n#Block comment\n```\n\nUse instead:\n```python\n# Block comment\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#comments\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "multiple-leading-hashes-for-block-comment",
    "code": "E266",
    "explanation": "## What it does\nChecks for block comments that start with multiple leading `#` characters.\n\n## Why is this bad?\nPer [PEP 8], \"Block comments generally consist of one or more paragraphs built\nout of complete sentences, with each sentence ending in a period.\"\n\nEach line of a block comment should start with a `#` followed by a single space.\n\nShebangs (lines starting with `#!`, at the top of a file) are exempt from this\nrule.\n\n## Example\n```python\n### Block comment\n```\n\nUse instead:\n```python\n# Block comment\n```\n\nAlternatively, this rule makes an exception for comments that consist\nsolely of `#` characters, as in:\n\n```python\n##############\n# Block header\n##############\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#comments\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "multiple-spaces-after-keyword",
    "code": "E271",
    "explanation": "## What it does\nChecks for extraneous whitespace after keywords.\n\n## Why is this bad?\n\n\n## Example\n```python\nTrue and  False\n```\n\nUse instead:\n```python\nTrue and False\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "multiple-spaces-before-keyword",
    "code": "E272",
    "explanation": "## What it does\nChecks for extraneous whitespace before keywords.\n\n## Why is this bad?\n\n\n## Example\n```python\nTrue  and False\n```\n\nUse instead:\n```python\nTrue and False\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "tab-after-keyword",
    "code": "E273",
    "explanation": "## What it does\nChecks for extraneous tabs after keywords.\n\n## Why is this bad?\n\n\n## Example\n```python\nTrue and\\tFalse\n```\n\nUse instead:\n```python\nTrue and False\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "tab-before-keyword",
    "code": "E274",
    "explanation": "## What it does\nChecks for extraneous tabs before keywords.\n\n## Why is this bad?\n\n\n## Example\n```python\nTrue\\tand False\n```\n\nUse instead:\n```python\nTrue and False\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "missing-whitespace-after-keyword",
    "code": "E275",
    "explanation": "## What it does\nChecks for missing whitespace after keywords.\n\n## Why is this bad?\nMissing whitespace after keywords makes the code harder to read.\n\n## Example\n```python\nif(True):\n    pass\n```\n\nUse instead:\n```python\nif (True):\n    pass\n```\n\n## References\n- [Python documentation: Keywords](https://docs.python.org/3/reference/lexical_analysis.html#keywords)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "blank-line-between-methods",
    "code": "E301",
    "explanation": "## What it does\nChecks for missing blank lines between methods of a class.\n\n## Why is this bad?\nPEP 8 recommends exactly one blank line between methods of a class.\n\n## Example\n```python\nclass MyClass(object):\n    def func1():\n        pass\n    def func2():\n        pass\n```\n\nUse instead:\n```python\nclass MyClass(object):\n    def func1():\n        pass\n\n    def func2():\n        pass\n```\n\n## Typing stub files (`.pyi`)\nThe typing style guide recommends to not use blank lines between methods except to group\nthem. That's why this rule is not enabled in typing stub files.\n\n## References\n- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)\n- [Flake 8 rule](https://www.flake8rules.com/rules/E301.html)\n- [Typing Style Guide](https://typing.readthedocs.io/en/latest/source/stubs.html#blank-lines)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "blank-lines-top-level",
    "code": "E302",
    "explanation": "## What it does\nChecks for missing blank lines between top level functions and classes.\n\n## Why is this bad?\nPEP 8 recommends exactly two blank lines between top level functions and classes.\n\nThe rule respects the [`lint.isort.lines-after-imports`] setting when\ndetermining the required number of blank lines between top-level `import`\nstatements and function or class definitions for compatibility with isort.\n\n## Example\n```python\ndef func1():\n    pass\ndef func2():\n    pass\n```\n\nUse instead:\n```python\ndef func1():\n    pass\n\n\ndef func2():\n    pass\n```\n\n## Typing stub files (`.pyi`)\nThe typing style guide recommends to not use blank lines between classes and functions except to group\nthem. That's why this rule is not enabled in typing stub files.\n\n## Options\n- `lint.isort.lines-after-imports`\n\n## References\n- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)\n- [Flake 8 rule](https://www.flake8rules.com/rules/E302.html)\n- [Typing Style Guide](https://typing.readthedocs.io/en/latest/source/stubs.html#blank-lines)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "too-many-blank-lines",
    "code": "E303",
    "explanation": "## What it does\nChecks for extraneous blank lines.\n\n## Why is this bad?\nPEP 8 recommends using blank lines as follows:\n- No more than two blank lines between top-level statements.\n- No more than one blank line between non-top-level statements.\n\n## Example\n```python\ndef func1():\n    pass\n\n\n\ndef func2():\n    pass\n```\n\nUse instead:\n```python\ndef func1():\n    pass\n\n\ndef func2():\n    pass\n```\n\n## Typing stub files (`.pyi`)\nThe rule allows at most one blank line in typing stub files in accordance to the typing style guide recommendation.\n\nNote: The rule respects the following `isort` settings when determining the maximum number of blank lines allowed between two statements:\n\n* [`lint.isort.lines-after-imports`]: For top-level statements directly following an import statement.\n* [`lint.isort.lines-between-types`]: For `import` statements directly following a `from ... import ...` statement or vice versa.\n\n## Options\n- `lint.isort.lines-after-imports`\n- `lint.isort.lines-between-types`\n\n## References\n- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)\n- [Flake 8 rule](https://www.flake8rules.com/rules/E303.html)\n- [Typing Style Guide](https://typing.readthedocs.io/en/latest/source/stubs.html#blank-lines)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "blank-line-after-decorator",
    "code": "E304",
    "explanation": "## What it does\nChecks for extraneous blank line(s) after function decorators.\n\n## Why is this bad?\nThere should be no blank lines between a decorator and the object it is decorating.\n\n## Example\n```python\nclass User(object):\n\n    @property\n\n    def name(self):\n        pass\n```\n\nUse instead:\n```python\nclass User(object):\n\n    @property\n    def name(self):\n        pass\n```\n\n## References\n- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)\n- [Flake 8 rule](https://www.flake8rules.com/rules/E304.html)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "blank-lines-after-function-or-class",
    "code": "E305",
    "explanation": "## What it does\nChecks for missing blank lines after the end of function or class.\n\n## Why is this bad?\nPEP 8 recommends using blank lines as follows:\n- Two blank lines are expected between functions and classes\n- One blank line is expected between methods of a class.\n\n## Example\n```python\nclass User(object):\n    pass\nuser = User()\n```\n\nUse instead:\n```python\nclass User(object):\n    pass\n\n\nuser = User()\n```\n\n## Typing stub files (`.pyi`)\nThe typing style guide recommends to not use blank lines between statements except to group\nthem. That's why this rule is not enabled in typing stub files.\n\n## References\n- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)\n- [Flake 8 rule](https://www.flake8rules.com/rules/E305.html)\n- [Typing Style Guide](https://typing.readthedocs.io/en/latest/source/stubs.html#blank-lines)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "blank-lines-before-nested-definition",
    "code": "E306",
    "explanation": "## What it does\nChecks for 1 blank line between nested function or class definitions.\n\n## Why is this bad?\nPEP 8 recommends using blank lines as follows:\n- Two blank lines are expected between functions and classes\n- One blank line is expected between methods of a class.\n\n## Example\n```python\ndef outer():\n    def inner():\n        pass\n    def inner2():\n        pass\n```\n\nUse instead:\n```python\ndef outer():\n    def inner():\n        pass\n\n    def inner2():\n        pass\n```\n\n## Typing stub files (`.pyi`)\nThe typing style guide recommends to not use blank lines between classes and functions except to group\nthem. That's why this rule is not enabled in typing stub files.\n\n## References\n- [PEP 8: Blank Lines](https://peps.python.org/pep-0008/#blank-lines)\n- [Flake 8 rule](https://www.flake8rules.com/rules/E306.html)\n- [Typing Style Guide](https://typing.readthedocs.io/en/latest/source/stubs.html#blank-lines)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "multiple-imports-on-one-line",
    "code": "E401",
    "explanation": "## What it does\nCheck for multiple imports on one line.\n\n## Why is this bad?\nAccording to [PEP 8], \"imports should usually be on separate lines.\"\n\n## Example\n```python\nimport sys, os\n```\n\nUse instead:\n```python\nimport os\nimport sys\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#imports\n",
    "fix": 1
  },
  {
    "name": "module-import-not-at-top-of-file",
    "code": "E402",
    "explanation": "## What it does\nChecks for imports that are not at the top of the file.\n\n## Why is this bad?\nAccording to [PEP 8], \"imports are always put at the top of the file, just after any\nmodule comments and docstrings, and before module globals and constants.\"\n\nThis rule makes an exception for both `sys.path` modifications (allowing for\n`sys.path.insert`, `sys.path.append`, etc.) and `os.environ` modifications\nbetween imports.\n\n## Example\n```python\n\"One string\"\n\"Two string\"\na = 1\nimport os\nfrom sys import x\n```\n\nUse instead:\n```python\nimport os\nfrom sys import x\n\n\"One string\"\n\"Two string\"\na = 1\n```\n\n## Notebook behavior\nFor Jupyter notebooks, this rule checks for imports that are not at the top of a *cell*.\n\n[PEP 8]: https://peps.python.org/pep-0008/#imports\n"
  },
  {
    "name": "line-too-long",
    "code": "E501",
    "explanation": "## What it does\nChecks for lines that exceed the specified maximum character length.\n\n## Why is this bad?\nOverlong lines can hurt readability. [PEP 8], for example, recommends\nlimiting lines to 79 characters. By default, this rule enforces a limit\nof 88 characters for compatibility with Black and the Ruff formatter,\nthough that limit is configurable via the [`line-length`] setting.\n\nIn the interest of pragmatism, this rule makes a few exceptions when\ndetermining whether a line is overlong. Namely, it:\n\n1. Ignores lines that consist of a single \"word\" (i.e., without any\n   whitespace between its characters).\n2. Ignores lines that end with a URL, as long as the URL starts before\n   the line-length threshold.\n3. Ignores line that end with a pragma comment (e.g., `# type: ignore`\n   or `# noqa`), as long as the pragma comment starts before the\n   line-length threshold. That is, a line will not be flagged as\n   overlong if a pragma comment _causes_ it to exceed the line length.\n   (This behavior aligns with that of the Ruff formatter.)\n4. Ignores SPDX license identifiers and copyright notices\n   (e.g., `# SPDX-License-Identifier: MIT`), which are machine-readable\n   and should _not_ wrap over multiple lines.\n\nIf [`lint.pycodestyle.ignore-overlong-task-comments`] is `true`, this rule will\nalso ignore comments that start with any of the specified [`lint.task-tags`]\n(e.g., `# TODO:`).\n\n## Example\n```python\nmy_function(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)\n```\n\nUse instead:\n```python\nmy_function(\n    param1, param2, param3, param4, param5,\n    param6, param7, param8, param9, param10\n)\n```\n\n## Error suppression\nHint: when suppressing `E501` errors within multi-line strings (like\ndocstrings), the `noqa` directive should come at the end of the string\n(after the closing triple quote), and will apply to the entire string, like\nso:\n\n```python\n\"\"\"Lorem ipsum dolor sit amet.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.\n\"\"\"  # noqa: E501\n```\n\n## Options\n- `line-length`\n- `lint.task-tags`\n- `lint.pycodestyle.ignore-overlong-task-comments`\n- `lint.pycodestyle.max-line-length`\n\n[PEP 8]: https://peps.python.org/pep-0008/#maximum-line-length\n"
  },
  {
    "name": "redundant-backslash",
    "code": "E502",
    "explanation": "## What it does\nChecks for redundant backslashes between brackets.\n\n## Why is this bad?\nExplicit line joins using a backslash are redundant between brackets.\n\n## Example\n```python\nx = (2 + \\\n    2)\n```\n\nUse instead:\n```python\nx = (2 +\n    2)\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#maximum-line-length\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "multiple-statements-on-one-line-colon",
    "code": "E701",
    "explanation": "## What it does\nChecks for compound statements (multiple statements on the same line).\n\n## Why is this bad?\nAccording to [PEP 8], \"compound statements are generally discouraged\".\n\n## Example\n```python\nif foo == \"blah\": do_blah_thing()\n```\n\nUse instead:\n```python\nif foo == \"blah\":\n    do_blah_thing()\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations\n"
  },
  {
    "name": "multiple-statements-on-one-line-semicolon",
    "code": "E702",
    "explanation": "## What it does\nChecks for multiline statements on one line.\n\n## Why is this bad?\nAccording to [PEP 8], including multi-clause statements on the same line is\ndiscouraged.\n\n## Example\n```python\ndo_one(); do_two(); do_three()\n```\n\nUse instead:\n```python\ndo_one()\ndo_two()\ndo_three()\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations\n"
  },
  {
    "name": "useless-semicolon",
    "code": "E703",
    "explanation": "## What it does\nChecks for statements that end with an unnecessary semicolon.\n\n## Why is this bad?\nA trailing semicolon is unnecessary and should be removed.\n\n## Example\n```python\ndo_four();  # useless semicolon\n```\n\nUse instead:\n```python\ndo_four()\n```\n",
    "fix": 2
  },
  {
    "name": "none-comparison",
    "code": "E711",
    "explanation": "## What it does\nChecks for comparisons to `None` which are not using the `is` operator.\n\n## Why is this bad?\nAccording to [PEP 8], \"Comparisons to singletons like None should always be done with\n`is` or `is not`, never the equality operators.\"\n\n## Example\n```python\nif arg != None:\n    pass\nif None == arg:\n    pass\n```\n\nUse instead:\n```python\nif arg is not None:\n    pass\n```\n\n## Fix safety\n\nThis rule's fix is marked as unsafe, as it may alter runtime behavior when\nused with libraries that override the `==`/`__eq__` or `!=`/`__ne__` operators.\nIn these cases, `is`/`is not` may not be equivalent to `==`/`!=`. For more\ninformation, see [this issue].\n\n[PEP 8]: https://peps.python.org/pep-0008/#programming-recommendations\n[this issue]: https://github.com/astral-sh/ruff/issues/4560\n",
    "fix": 2
  },
  {
    "name": "true-false-comparison",
    "code": "E712",
    "explanation": "## What it does\nChecks for equality comparisons to boolean literals.\n\n## Why is this bad?\n[PEP 8] recommends against using the equality operators `==` and `!=` to\ncompare values to `True` or `False`.\n\nInstead, use `if cond:` or `if not cond:` to check for truth values.\n\nIf you intend to check if a value is the boolean literal `True` or `False`,\nconsider using `is` or `is not` to check for identity instead.\n\n## Example\n```python\nif foo == True:\n    ...\n\nif bar == False:\n    ...\n```\n\nUse instead:\n```python\nif foo:\n    ...\n\nif not bar:\n    ...\n```\n\n## Fix safety\n\nThis rule's fix is marked as unsafe, as it may alter runtime behavior when\nused with libraries that override the `==`/`__eq__` or `!=`/`__ne__` operators.\nIn these cases, `is`/`is not` may not be equivalent to `==`/`!=`. For more\ninformation, see [this issue].\n\n[PEP 8]: https://peps.python.org/pep-0008/#programming-recommendations\n[this issue]: https://github.com/astral-sh/ruff/issues/4560\n",
    "fix": 2
  },
  {
    "name": "not-in-test",
    "code": "E713",
    "explanation": "## What it does\nChecks for membership tests using `not {element} in {collection}`.\n\n## Why is this bad?\nTesting membership with `{element} not in {collection}` is more readable.\n\n## Example\n```python\nZ = not X in Y\nif not X.B in Y:\n    pass\n```\n\nUse instead:\n```python\nZ = X not in Y\nif X.B not in Y:\n    pass\n```\n",
    "fix": 2
  },
  {
    "name": "not-is-test",
    "code": "E714",
    "explanation": "## What it does\nChecks for identity comparisons using `not {foo} is {bar}`.\n\n## Why is this bad?\nAccording to [PEP8], testing for an object's identity with `is not` is more\nreadable.\n\n## Example\n```python\nif not X is Y:\n    pass\nZ = not X.B is Y\n```\n\nUse instead:\n```python\nif X is not Y:\n    pass\nZ = X.B is not Y\n```\n\n[PEP8]: https://peps.python.org/pep-0008/#programming-recommendations\n",
    "fix": 2
  },
  {
    "name": "type-comparison",
    "code": "E721",
    "explanation": "## What it does\nChecks for object type comparisons using `==` and other comparison\noperators.\n\n## Why is this bad?\nUnlike a direct type comparison, `isinstance` will also check if an object\nis an instance of a class or a subclass thereof.\n\nIf you want to check for an exact type match, use `is` or `is not`.\n\n## Known problems\nWhen using libraries that override the `==` (`__eq__`) operator (such as NumPy,\nPandas, and SQLAlchemy), this rule may produce false positives, as converting\nfrom `==` to `is` or `is not` will change the behavior of the code.\n\nFor example, the following operations are _not_ equivalent:\n```python\nimport numpy as np\n\nnp.array([True, False]) == False\n# array([False,  True])\n\nnp.array([True, False]) is False\n# False\n```\n\n## Example\n```python\nif type(obj) == type(1):\n    pass\n\nif type(obj) == int:\n    pass\n```\n\nUse instead:\n```python\nif isinstance(obj, int):\n    pass\n```\n"
  },
  {
    "name": "bare-except",
    "code": "E722",
    "explanation": "## What it does\nChecks for bare `except` catches in `try`-`except` statements.\n\n## Why is this bad?\nA bare `except` catches `BaseException` which includes\n`KeyboardInterrupt`, `SystemExit`, `Exception`, and others. Catching\n`BaseException` can make it hard to interrupt the program (e.g., with\nCtrl-C) and can disguise other problems.\n\n## Example\n```python\ntry:\n    raise KeyboardInterrupt(\"You probably don't mean to break CTRL-C.\")\nexcept:\n    print(\"But a bare `except` will ignore keyboard interrupts.\")\n```\n\nUse instead:\n```python\ntry:\n    do_something_that_might_break()\nexcept MoreSpecificException as e:\n    handle_error(e)\n```\n\nIf you actually need to catch an unknown error, use `Exception` which will\ncatch regular program errors but not important system exceptions.\n\n```python\ndef run_a_function(some_other_fn):\n    try:\n        some_other_fn()\n    except Exception as e:\n        print(f\"How exceptional! {e}\")\n```\n\n## References\n- [Python documentation: Exception hierarchy](https://docs.python.org/3/library/exceptions.html#exception-hierarchy)\n- [Google Python Style Guide: \"Exceptions\"](https://google.github.io/styleguide/pyguide.html#24-exceptions)\n"
  },
  {
    "name": "lambda-assignment",
    "code": "E731",
    "explanation": "## What it does\nChecks for lambda expressions which are assigned to a variable.\n\n## Why is this bad?\nPer PEP 8, you should \"Always use a def statement instead of an assignment\nstatement that binds a lambda expression directly to an identifier.\"\n\nUsing a `def` statement leads to better tracebacks, and the assignment\nitself negates the primary benefit of using a `lambda` expression (i.e.,\nthat it can be embedded inside another expression).\n\n## Example\n```python\nf = lambda x: 2 * x\n```\n\nUse instead:\n```python\ndef f(x):\n    return 2 * x\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#programming-recommendations\n",
    "fix": 1
  },
  {
    "name": "ambiguous-variable-name",
    "code": "E741",
    "explanation": "## What it does\nChecks for the use of the characters 'l', 'O', or 'I' as variable names.\n\nNote: This rule is automatically disabled for all stub files\n(files with `.pyi` extensions). The rule has little relevance for authors\nof stubs: a well-written stub should aim to faithfully represent the\ninterface of the equivalent .py file as it exists at runtime, including any\nambiguously named variables in the runtime module.\n\n## Why is this bad?\nIn some fonts, these characters are indistinguishable from the\nnumerals one and zero. When tempted to use 'l', use 'L' instead.\n\n## Example\n```python\nl = 0\nO = 123\nI = 42\n```\n\nUse instead:\n```python\nL = 0\no = 123\ni = 42\n```\n\n"
  },
  {
    "name": "ambiguous-class-name",
    "code": "E742",
    "explanation": "## What it does\nChecks for the use of the characters 'l', 'O', or 'I' as class names.\n\n## Why is this bad?\nIn some fonts, these characters are indistinguishable from the\nnumerals one and zero. When tempted to use 'l', use 'L' instead.\n\n## Example\n\n```python\nclass I(object): ...\n```\n\nUse instead:\n\n```python\nclass Integer(object): ...\n```\n"
  },
  {
    "name": "ambiguous-function-name",
    "code": "E743",
    "explanation": "## What it does\nChecks for the use of the characters 'l', 'O', or 'I' as function names.\n\n## Why is this bad?\nIn some fonts, these characters are indistinguishable from the\nnumerals one and zero. When tempted to use 'l', use 'L' instead.\n\n## Example\n\n```python\ndef l(x): ...\n```\n\nUse instead:\n\n```python\ndef long_name(x): ...\n```\n"
  },
  {
    "name": "io-error",
    "code": "E902",
    "explanation": "## What it does\nThis is not a regular diagnostic; instead, it's raised when a file cannot be read\nfrom disk.\n\n## Why is this bad?\nAn `IOError` indicates an error in the development setup. For example, the user may\nnot have permissions to read a given file, or the filesystem may contain a broken\nsymlink.\n\n## Example\nOn Linux or macOS:\n```shell\n$ echo 'print(\"hello world!\")' > a.py\n$ chmod 000 a.py\n$ ruff a.py\na.py:1:1: E902 Permission denied (os error 13)\nFound 1 error.\n```\n\n## References\n- [UNIX Permissions introduction](https://mason.gmu.edu/~montecin/UNIXpermiss.htm)\n- [Command Line Basics: Symbolic Links](https://www.digitalocean.com/community/tutorials/workflow-symbolic-links)\n"
  },
  {
    "name": "syntax-error",
    "code": "E999",
    "explanation": "## Removed\nThis rule has been removed. Syntax errors will\nalways be shown regardless of whether this rule is selected or not.\n\n## What it does\nChecks for code that contains syntax errors.\n\n## Why is this bad?\nCode with syntax errors cannot be executed. Such errors are likely a\nmistake.\n\n## Example\n```python\nx =\n```\n\nUse instead:\n```python\nx = 1\n```\n\n## References\n- [Python documentation: Syntax Errors](https://docs.python.org/3/tutorial/errors.html#syntax-errors)\n"
  },
  {
    "name": "tab-indentation",
    "code": "W191",
    "explanation": "## What it does\nChecks for indentation that uses tabs.\n\n## Why is this bad?\nAccording to [PEP 8], spaces are preferred over tabs (unless used to remain\nconsistent with code that is already indented with tabs).\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent indentation, making the rule redundant.\n\nThe rule is also incompatible with the [formatter] when using\n`format.indent-style=\"tab\"`.\n\n[PEP 8]: https://peps.python.org/pep-0008/#tabs-or-spaces\n[formatter]: https://docs.astral.sh/ruff/formatter\n"
  },
  {
    "name": "trailing-whitespace",
    "code": "W291",
    "explanation": "## What it does\nChecks for superfluous trailing whitespace.\n\n## Why is this bad?\nAccording to [PEP 8], \"avoid trailing whitespace anywhere. Because it\u2019s usually\ninvisible, it can be confusing\"\n\n## Example\n```python\nspam(1) \\n#\n```\n\nUse instead:\n```python\nspam(1)\\n#\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations\n",
    "fix": 2
  },
  {
    "name": "missing-newline-at-end-of-file",
    "code": "W292",
    "explanation": "## What it does\nChecks for files missing a new line at the end of the file.\n\n## Why is this bad?\nTrailing blank lines in a file are superfluous.\n\nHowever, the last line of the file should end with a newline.\n\n## Example\n```python\nspam(1)\n```\n\nUse instead:\n```python\nspam(1)\\n\n```\n",
    "fix": 2
  },
  {
    "name": "blank-line-with-whitespace",
    "code": "W293",
    "explanation": "## What it does\nChecks for superfluous whitespace in blank lines.\n\n## Why is this bad?\nAccording to [PEP 8], \"avoid trailing whitespace anywhere. Because it\u2019s usually\ninvisible, it can be confusing\"\n\n## Example\n```python\nclass Foo(object):\\n    \\n    bang = 12\n```\n\nUse instead:\n```python\nclass Foo(object):\\n\\n    bang = 12\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#other-recommendations\n",
    "fix": 2
  },
  {
    "name": "too-many-newlines-at-end-of-file",
    "code": "W391",
    "explanation": "## What it does\nChecks for files with multiple trailing blank lines.\n\nIn the case of notebooks, this check is applied to\neach cell separately.\n\n## Why is this bad?\nTrailing blank lines in a file are superfluous.\n\nHowever, the last line of the file should end with a newline.\n\n## Example\n```python\nspam(1)\\n\\n\\n\n```\n\nUse instead:\n```python\nspam(1)\\n\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "doc-line-too-long",
    "code": "W505",
    "explanation": "## What it does\nChecks for doc lines that exceed the specified maximum character length.\n\n## Why is this bad?\nFor flowing long blocks of text (docstrings or comments), overlong lines\ncan hurt readability. [PEP 8], for example, recommends that such lines be\nlimited to 72 characters, while this rule enforces the limit specified by\nthe [`lint.pycodestyle.max-doc-length`] setting. (If no value is provided, this\nrule will be ignored, even if it's added to your `--select` list.)\n\nIn the context of this rule, a \"doc line\" is defined as a line consisting\nof either a standalone comment or a standalone string, like a docstring.\n\nIn the interest of pragmatism, this rule makes a few exceptions when\ndetermining whether a line is overlong. Namely, it:\n\n1. Ignores lines that consist of a single \"word\" (i.e., without any\n   whitespace between its characters).\n2. Ignores lines that end with a URL, as long as the URL starts before\n   the line-length threshold.\n3. Ignores line that end with a pragma comment (e.g., `# type: ignore`\n   or `# noqa`), as long as the pragma comment starts before the\n   line-length threshold. That is, a line will not be flagged as\n   overlong if a pragma comment _causes_ it to exceed the line length.\n   (This behavior aligns with that of the Ruff formatter.)\n\nIf [`lint.pycodestyle.ignore-overlong-task-comments`] is `true`, this rule will\nalso ignore comments that start with any of the specified [`lint.task-tags`]\n(e.g., `# TODO:`).\n\n## Example\n```python\ndef function(x):\n    \"\"\"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis auctor purus ut ex fermentum, at maximus est hendrerit.\"\"\"\n```\n\nUse instead:\n```python\ndef function(x):\n    \"\"\"\n    Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n    Duis auctor purus ut ex fermentum, at maximus est hendrerit.\n    \"\"\"\n```\n\n## Error suppression\nHint: when suppressing `W505` errors within multi-line strings (like\ndocstrings), the `noqa` directive should come at the end of the string\n(after the closing triple quote), and will apply to the entire string, like\nso:\n\n```python\n\"\"\"Lorem ipsum dolor sit amet.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.\n\"\"\"  # noqa: W505\n```\n\n## Options\n- `lint.task-tags`\n- `lint.pycodestyle.max-doc-length`\n- `lint.pycodestyle.ignore-overlong-task-comments`\n\n[PEP 8]: https://peps.python.org/pep-0008/#maximum-line-length\n"
  },
  {
    "name": "invalid-escape-sequence",
    "code": "W605",
    "explanation": "## What it does\nChecks for invalid escape sequences.\n\n## Why is this bad?\nInvalid escape sequences are deprecated in Python 3.6.\n\n## Example\n```python\nregex = \"\\.png$\"\n```\n\nUse instead:\n```python\nregex = r\"\\.png$\"\n```\n\nOr, if the string already contains a valid escape sequence:\n```python\nvalue = \"new line\\nand invalid escape \\_ here\"\n```\n\nUse instead:\n```python\nvalue = \"new line\\nand invalid escape \\\\_ here\"\n```\n\n## References\n- [Python documentation: String and Bytes literals](https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals)\n",
    "fix": 2
  },
  {
    "name": "docstring-missing-returns",
    "code": "DOC201",
    "explanation": "## What it does\nChecks for functions with `return` statements that do not have \"Returns\"\nsections in their docstrings.\n\n## Why is this bad?\nA missing \"Returns\" section is a sign of incomplete documentation.\n\nThis rule is not enforced for abstract methods or functions that only return\n`None`. It is also ignored for \"stub functions\": functions where the body only\nconsists of `pass`, `...`, `raise NotImplementedError`, or similar.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n    \"\"\"\n    return distance / time\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n    \"\"\"\n    return distance / time\n```\n",
    "preview": true
  },
  {
    "name": "docstring-extraneous-returns",
    "code": "DOC202",
    "explanation": "## What it does\nChecks for function docstrings with unnecessary \"Returns\" sections.\n\n## Why is this bad?\nA function without an explicit `return` statement should not have a\n\"Returns\" section in its docstring.\n\nThis rule is not enforced for abstract methods. It is also ignored for\n\"stub functions\": functions where the body only consists of `pass`, `...`,\n`raise NotImplementedError`, or similar.\n\n## Example\n```python\ndef say_hello(n: int) -> None:\n    \"\"\"Says hello to the user.\n\n    Args:\n        n: Number of times to say hello.\n\n    Returns:\n        Doesn't return anything.\n    \"\"\"\n    for _ in range(n):\n        print(\"Hello!\")\n```\n\nUse instead:\n```python\ndef say_hello(n: int) -> None:\n    \"\"\"Says hello to the user.\n\n    Args:\n        n: Number of times to say hello.\n    \"\"\"\n    for _ in range(n):\n        print(\"Hello!\")\n```\n",
    "preview": true
  },
  {
    "name": "docstring-missing-yields",
    "code": "DOC402",
    "explanation": "## What it does\nChecks for functions with `yield` statements that do not have \"Yields\" sections in\ntheir docstrings.\n\n## Why is this bad?\nA missing \"Yields\" section is a sign of incomplete documentation.\n\nThis rule is not enforced for abstract methods or functions that only yield `None`.\nIt is also ignored for \"stub functions\": functions where the body only consists\nof `pass`, `...`, `raise NotImplementedError`, or similar.\n\n## Example\n```python\ndef count_to_n(n: int) -> int:\n    \"\"\"Generate integers up to *n*.\n\n    Args:\n        n: The number at which to stop counting.\n    \"\"\"\n    for i in range(1, n + 1):\n        yield i\n```\n\nUse instead:\n```python\ndef count_to_n(n: int) -> int:\n    \"\"\"Generate integers up to *n*.\n\n    Args:\n        n: The number at which to stop counting.\n\n    Yields:\n        int: The number we're at in the count.\n    \"\"\"\n    for i in range(1, n + 1):\n        yield i\n```\n",
    "preview": true
  },
  {
    "name": "docstring-extraneous-yields",
    "code": "DOC403",
    "explanation": "## What it does\nChecks for function docstrings with unnecessary \"Yields\" sections.\n\n## Why is this bad?\nA function that doesn't yield anything should not have a \"Yields\" section\nin its docstring.\n\nThis rule is not enforced for abstract methods. It is also ignored for\n\"stub functions\": functions where the body only consists of `pass`, `...`,\n`raise NotImplementedError`, or similar.\n\n## Example\n```python\ndef say_hello(n: int) -> None:\n    \"\"\"Says hello to the user.\n\n    Args:\n        n: Number of times to say hello.\n\n    Yields:\n        Doesn't yield anything.\n    \"\"\"\n    for _ in range(n):\n        print(\"Hello!\")\n```\n\nUse instead:\n```python\ndef say_hello(n: int) -> None:\n    \"\"\"Says hello to the user.\n\n    Args:\n        n: Number of times to say hello.\n    \"\"\"\n    for _ in range(n):\n        print(\"Hello!\")\n```\n",
    "preview": true
  },
  {
    "name": "docstring-missing-exception",
    "code": "DOC501",
    "explanation": "## What it does\nChecks for function docstrings that do not document all explicitly raised\nexceptions.\n\n## Why is this bad?\nA function should document all exceptions that are directly raised in some\ncircumstances. Failing to document an exception that could be raised\ncan be misleading to users and/or a sign of incomplete documentation.\n\nThis rule is not enforced for abstract methods. It is also ignored for\n\"stub functions\": functions where the body only consists of `pass`, `...`,\n`raise NotImplementedError`, or similar.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n",
    "preview": true
  },
  {
    "name": "docstring-extraneous-exception",
    "code": "DOC502",
    "explanation": "## What it does\nChecks for function docstrings that state that exceptions could be raised\neven though they are not directly raised in the function body.\n\n## Why is this bad?\nSome conventions prefer non-explicit exceptions be omitted from the\ndocstring.\n\nThis rule is not enforced for abstract methods. It is also ignored for\n\"stub functions\": functions where the body only consists of `pass`, `...`,\n`raise NotImplementedError`, or similar.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        ZeroDivisionError: Divided by zero.\n    \"\"\"\n    return distance / time\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n    \"\"\"\n    return distance / time\n```\n\n## Known issues\nIt may often be desirable to document *all* exceptions that a function\ncould possibly raise, even those which are not explicitly raised using\n`raise` statements in the function body.\n",
    "preview": true
  },
  {
    "name": "undocumented-public-module",
    "code": "D100",
    "explanation": "## What it does\nChecks for undocumented public module definitions.\n\n## Why is this bad?\nPublic modules should be documented via docstrings to outline their purpose\nand contents.\n\nGenerally, module docstrings should describe the purpose of the module and\nlist the classes, exceptions, functions, and other objects that are exported\nby the module, alongside a one-line summary of each.\n\nIf the module is a script, the docstring should be usable as its \"usage\"\nmessage.\n\nIf the codebase adheres to a standard format for module docstrings, follow\nthat format for consistency.\n\n## Example\n\n```python\nclass FasterThanLightError(ZeroDivisionError): ...\n\n\ndef calculate_speed(distance: float, time: float) -> float: ...\n```\n\nUse instead:\n\n```python\n\"\"\"Utility functions and classes for calculating speed.\n\nThis module provides:\n- FasterThanLightError: exception when FTL speed is calculated;\n- calculate_speed: calculate speed given distance and time.\n\"\"\"\n\n\nclass FasterThanLightError(ZeroDivisionError): ...\n\n\ndef calculate_speed(distance: float, time: float) -> float: ...\n```\n\n## Notebook behavior\nThis rule is ignored for Jupyter Notebooks.\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n"
  },
  {
    "name": "undocumented-public-class",
    "code": "D101",
    "explanation": "## What it does\nChecks for undocumented public class definitions.\n\n## Why is this bad?\nPublic classes should be documented via docstrings to outline their purpose\nand behavior.\n\nGenerally, a class docstring should describe the class's purpose and list\nits public attributes and methods.\n\nIf the codebase adheres to a standard format for class docstrings, follow\nthat format for consistency.\n\n## Example\n```python\nclass Player:\n    def __init__(self, name: str, points: int = 0) -> None:\n        self.name: str = name\n        self.points: int = points\n\n    def add_points(self, points: int) -> None:\n        self.points += points\n```\n\nUse instead (in the NumPy docstring format):\n```python\nclass Player:\n    \"\"\"A player in the game.\n\n    Attributes\n    ----------\n    name : str\n        The name of the player.\n    points : int\n        The number of points the player has.\n\n    Methods\n    -------\n    add_points(points: int) -> None\n        Add points to the player's score.\n    \"\"\"\n\n    def __init__(self, name: str, points: int = 0) -> None:\n        self.name: str = name\n        self.points: int = points\n\n    def add_points(self, points: int) -> None:\n        self.points += points\n```\n\nOr (in the Google docstring format):\n```python\nclass Player:\n    \"\"\"A player in the game.\n\n    Attributes:\n        name: The name of the player.\n        points: The number of points the player has.\n    \"\"\"\n\n    def __init__(self, name: str, points: int = 0) -> None:\n        self.name: str = name\n        self.points: int = points\n\n    def add_points(self, points: int) -> None:\n        self.points += points\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n"
  },
  {
    "name": "undocumented-public-method",
    "code": "D102",
    "explanation": "## What it does\nChecks for undocumented public method definitions.\n\n## Why is this bad?\nPublic methods should be documented via docstrings to outline their purpose\nand behavior.\n\nGenerally, a method docstring should describe the method's behavior,\narguments, side effects, exceptions, return values, and any other\ninformation that may be relevant to the user.\n\nIf the codebase adheres to a standard format for method docstrings, follow\nthat format for consistency.\n\n## Example\n```python\nclass Cat(Animal):\n    def greet(self, happy: bool = True):\n        if happy:\n            print(\"Meow!\")\n        else:\n            raise ValueError(\"Tried to greet an unhappy cat.\")\n```\n\nUse instead (in the NumPy docstring format):\n```python\nclass Cat(Animal):\n    def greet(self, happy: bool = True):\n        \"\"\"Print a greeting from the cat.\n\n        Parameters\n        ----------\n        happy : bool, optional\n            Whether the cat is happy, is True by default.\n\n        Raises\n        ------\n        ValueError\n            If the cat is not happy.\n        \"\"\"\n        if happy:\n            print(\"Meow!\")\n        else:\n            raise ValueError(\"Tried to greet an unhappy cat.\")\n```\n\nOr (in the Google docstring format):\n```python\nclass Cat(Animal):\n    def greet(self, happy: bool = True):\n        \"\"\"Print a greeting from the cat.\n\n        Args:\n            happy: Whether the cat is happy, is True by default.\n\n        Raises:\n            ValueError: If the cat is not happy.\n        \"\"\"\n        if happy:\n            print(\"Meow!\")\n        else:\n            raise ValueError(\"Tried to greet an unhappy cat.\")\n```\n\n## Options\n- `lint.pydocstyle.ignore-decorators`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n"
  },
  {
    "name": "undocumented-public-function",
    "code": "D103",
    "explanation": "## What it does\nChecks for undocumented public function definitions.\n\n## Why is this bad?\nPublic functions should be documented via docstrings to outline their\npurpose and behavior.\n\nGenerally, a function docstring should describe the function's behavior,\narguments, side effects, exceptions, return values, and any other\ninformation that may be relevant to the user.\n\nIf the codebase adheres to a standard format for function docstrings, follow\nthat format for consistency.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead (using the NumPy docstring format):\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nOr, using the Google docstring format:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.ignore-decorators`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings)\n"
  },
  {
    "name": "undocumented-public-package",
    "code": "D104",
    "explanation": "## What it does\nChecks for undocumented public package definitions.\n\n## Why is this bad?\nPublic packages should be documented via docstrings to outline their\npurpose and contents.\n\nGenerally, package docstrings should list the modules and subpackages that\nare exported by the package.\n\nIf the codebase adheres to a standard format for package docstrings, follow\nthat format for consistency.\n\n## Example\n```python\n__all__ = [\"Player\", \"Game\"]\n```\n\nUse instead:\n```python\n\"\"\"Game and player management package.\n\nThis package provides classes for managing players and games.\n\"\"\"\n\n__all__ = [\"player\", \"game\"]\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings)\n"
  },
  {
    "name": "undocumented-magic-method",
    "code": "D105",
    "explanation": "## What it does\nChecks for undocumented magic method definitions.\n\n## Why is this bad?\nMagic methods (methods with names that start and end with double\nunderscores) are used to implement operator overloading and other special\nbehavior. Such methods should be documented via docstrings to\noutline their behavior.\n\nGenerally, magic method docstrings should describe the method's behavior,\narguments, side effects, exceptions, return values, and any other\ninformation that may be relevant to the user.\n\nIf the codebase adheres to a standard format for method docstrings, follow\nthat format for consistency.\n\n## Example\n```python\nclass Cat(Animal):\n    def __str__(self) -> str:\n        return f\"Cat: {self.name}\"\n\n\ncat = Cat(\"Dusty\")\nprint(cat)  # \"Cat: Dusty\"\n```\n\nUse instead:\n```python\nclass Cat(Animal):\n    def __str__(self) -> str:\n        \"\"\"Return a string representation of the cat.\"\"\"\n        return f\"Cat: {self.name}\"\n\n\ncat = Cat(\"Dusty\")\nprint(cat)  # \"Cat: Dusty\"\n```\n\n## Options\n- `lint.pydocstyle.ignore-decorators`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings)\n"
  },
  {
    "name": "undocumented-public-nested-class",
    "code": "D106",
    "explanation": "## What it does\nChecks for undocumented public class definitions, for nested classes.\n\n## Why is this bad?\nPublic classes should be documented via docstrings to outline their\npurpose and behavior.\n\nNested classes do not inherit the docstring of their enclosing class, so\nthey should have their own docstrings.\n\nIf the codebase adheres to a standard format for class docstrings, follow\nthat format for consistency.\n\n## Example\n\n```python\nclass Foo:\n    \"\"\"Class Foo.\"\"\"\n\n    class Bar: ...\n\n\nbar = Foo.Bar()\nbar.__doc__  # None\n```\n\nUse instead:\n\n```python\nclass Foo:\n    \"\"\"Class Foo.\"\"\"\n\n    class Bar:\n        \"\"\"Class Bar.\"\"\"\n\n\nbar = Foo.Bar()\nbar.__doc__  # \"Class Bar.\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings)\n"
  },
  {
    "name": "undocumented-public-init",
    "code": "D107",
    "explanation": "## What it does\nChecks for public `__init__` method definitions that are missing\ndocstrings.\n\n## Why is this bad?\nPublic `__init__` methods are used to initialize objects. `__init__`\nmethods should be documented via docstrings to describe the method's\nbehavior, arguments, side effects, exceptions, and any other information\nthat may be relevant to the user.\n\nIf the codebase adheres to a standard format for `__init__` method docstrings,\nfollow that format for consistency.\n\n## Example\n```python\nclass City:\n    def __init__(self, name: str, population: int) -> None:\n        self.name: str = name\n        self.population: int = population\n```\n\nUse instead:\n```python\nclass City:\n    def __init__(self, name: str, population: int) -> None:\n        \"\"\"Initialize a city with a name and population.\"\"\"\n        self.name: str = name\n        self.population: int = population\n```\n\n## Options\n- `lint.pydocstyle.ignore-decorators`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Style Python Docstrings](https://google.github.io/styleguide/pyguide.html#s3.8-comments-and-docstrings)\n"
  },
  {
    "name": "unnecessary-multiline-docstring",
    "code": "D200",
    "explanation": "## What it does\nChecks for single-line docstrings that are broken across multiple lines.\n\n## Why is this bad?\n[PEP 257] recommends that docstrings that _can_ fit on one line should be\nformatted on a single line, for consistency and readability.\n\n## Example\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"\n    Return the mean of the given values.\n    \"\"\"\n```\n\nUse instead:\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values.\"\"\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n\n[PEP 257]: https://peps.python.org/pep-0257/\n",
    "fix": 1
  },
  {
    "name": "blank-line-before-function",
    "code": "D201",
    "explanation": "## What it does\nChecks for docstrings on functions that are separated by one or more blank\nlines from the function definition.\n\n## Why is this bad?\nRemove any blank lines between the function definition and its docstring,\nfor consistency.\n\n## Example\n```python\ndef average(values: list[float]) -> float:\n\n    \"\"\"Return the mean of the given values.\"\"\"\n```\n\nUse instead:\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values.\"\"\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n",
    "fix": 2
  },
  {
    "name": "blank-line-after-function",
    "code": "D202",
    "explanation": "## What it does\nChecks for docstrings on functions that are separated by one or more blank\nlines from the function body.\n\n## Why is this bad?\nRemove any blank lines between the function body and the function\ndocstring, for consistency.\n\n## Example\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values.\"\"\"\n\n    return sum(values) / len(values)\n```\n\nUse instead:\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values.\"\"\"\n    return sum(values) / len(values)\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n",
    "fix": 2
  },
  {
    "name": "incorrect-blank-line-before-class",
    "code": "D203",
    "explanation": "## What it does\nChecks for docstrings on class definitions that are not preceded by a\nblank line.\n\n## Why is this bad?\nUse a blank line to separate the docstring from the class definition, for\nconsistency.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, this rule is disabled when using the `google`,\n`numpy`, and `pep257` conventions.\n\nFor an alternative, see [D211].\n\n## Example\n\n```python\nclass PhotoMetadata:\n    \"\"\"Metadata about a photo.\"\"\"\n```\n\nUse instead:\n\n```python\nclass PhotoMetadata:\n\n    \"\"\"Metadata about a photo.\"\"\"\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n[D211]: https://docs.astral.sh/ruff/rules/blank-line-before-class\n",
    "fix": 2
  },
  {
    "name": "incorrect-blank-line-after-class",
    "code": "D204",
    "explanation": "## What it does\nChecks for class methods that are not separated from the class's docstring\nby a blank line.\n\n## Why is this bad?\n[PEP 257] recommends the use of a blank line to separate a class's\ndocstring from its methods.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, this rule is enabled when using the `numpy` and `pep257`\nconventions, and disabled when using the `google` convention.\n\n## Example\n```python\nclass PhotoMetadata:\n    \"\"\"Metadata about a photo.\"\"\"\n    def __init__(self, file: Path):\n        ...\n```\n\nUse instead:\n```python\nclass PhotoMetadata:\n    \"\"\"Metadata about a photo.\"\"\"\n\n    def __init__(self, file: Path):\n        ...\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[PEP 257]: https://peps.python.org/pep-0257/\n",
    "fix": 2
  },
  {
    "name": "missing-blank-line-after-summary",
    "code": "D205",
    "explanation": "## What it does\nChecks for docstring summary lines that are not separated from the docstring\ndescription by one blank line.\n\n## Why is this bad?\n[PEP 257] recommends that multi-line docstrings consist of \"a summary line\njust like a one-line docstring, followed by a blank line, followed by a\nmore elaborate description.\"\n\n## Example\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"Return a sorted copy of the list.\n    Sort the list in ascending order and return a copy of the\n    result using the bubble sort algorithm.\n    \"\"\"\n```\n\nUse instead:\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"Return a sorted copy of the list.\n\n    Sort the list in ascending order and return a copy of the\n    result using the bubble sort algorithm.\n    \"\"\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[PEP 257]: https://peps.python.org/pep-0257/\n",
    "fix": 1
  },
  {
    "name": "docstring-tab-indentation",
    "code": "D206",
    "explanation": "## What it does\nChecks for docstrings that are indented with tabs.\n\n## Why is this bad?\n[PEP 8] recommends using spaces over tabs for indentation.\n\n## Example\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"Return a sorted copy of the list.\n\n\tSort the list in ascending order and return a copy of the result using the bubble\n\tsort algorithm.\n    \"\"\"\n```\n\nUse instead:\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"Return a sorted copy of the list.\n\n    Sort the list in ascending order and return a copy of the result using the bubble\n    sort algorithm.\n    \"\"\"\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent indentation, making the rule redundant.\n\nThe rule is also incompatible with the [formatter] when using\n`format.indent-style=\"tab\"`.\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[PEP 8]: https://peps.python.org/pep-0008/#tabs-or-spaces\n[formatter]: https://docs.astral.sh/ruff/formatter\n"
  },
  {
    "name": "under-indentation",
    "code": "D207",
    "explanation": "## What it does\nChecks for under-indented docstrings.\n\n## Why is this bad?\n[PEP 257] recommends that docstrings be indented to the same level as their\nopening quotes. Avoid under-indenting docstrings, for consistency.\n\n## Example\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"Return a sorted copy of the list.\n\nSort the list in ascending order and return a copy of the result using the bubble sort\nalgorithm.\n    \"\"\"\n```\n\nUse instead:\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"Return a sorted copy of the list.\n\n    Sort the list in ascending order and return a copy of the result using the bubble\n    sort algorithm.\n    \"\"\"\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent indentation, making the rule redundant.\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[PEP 257]: https://peps.python.org/pep-0257/\n[formatter]: https://docs.astral.sh/ruff/formatter/\n",
    "fix": 2
  },
  {
    "name": "over-indentation",
    "code": "D208",
    "explanation": "## What it does\nChecks for over-indented docstrings.\n\n## Why is this bad?\n[PEP 257] recommends that docstrings be indented to the same level as their\nopening quotes. Avoid over-indenting docstrings, for consistency.\n\n## Example\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"Return a sorted copy of the list.\n\n        Sort the list in ascending order and return a copy of the result using the\n        bubble sort algorithm.\n    \"\"\"\n```\n\nUse instead:\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"Return a sorted copy of the list.\n\n    Sort the list in ascending order and return a copy of the result using the bubble\n    sort algorithm.\n    \"\"\"\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent indentation, making the rule redundant.\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[PEP 257]: https://peps.python.org/pep-0257/\n[formatter]:https://docs.astral.sh/ruff/formatter/\n",
    "fix": 2
  },
  {
    "name": "new-line-after-last-paragraph",
    "code": "D209",
    "explanation": "## What it does\nChecks for multi-line docstrings whose closing quotes are not on their\nown line.\n\n## Why is this bad?\n[PEP 257] recommends that the closing quotes of a multi-line docstring be\non their own line, for consistency and compatibility with documentation\ntools that may need to parse the docstring.\n\n## Example\n```python\ndef sort_list(l: List[int]) -> List[int]:\n    \"\"\"Return a sorted copy of the list.\n\n    Sort the list in ascending order and return a copy of the result using the\n    bubble sort algorithm.\"\"\"\n```\n\nUse instead:\n```python\ndef sort_list(l: List[int]) -> List[int]:\n    \"\"\"Return a sorted copy of the list.\n\n    Sort the list in ascending order and return a copy of the result using the bubble\n    sort algorithm.\n    \"\"\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[PEP 257]: https://peps.python.org/pep-0257/\n",
    "fix": 2
  },
  {
    "name": "surrounding-whitespace",
    "code": "D210",
    "explanation": "## What it does\nChecks for surrounding whitespace in docstrings.\n\n## Why is this bad?\nRemove surrounding whitespace from the docstring, for consistency.\n\n## Example\n```python\ndef factorial(n: int) -> int:\n    \"\"\" Return the factorial of n. \"\"\"\n```\n\nUse instead:\n```python\ndef factorial(n: int) -> int:\n    \"\"\"Return the factorial of n.\"\"\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n",
    "fix": 1
  },
  {
    "name": "blank-line-before-class",
    "code": "D211",
    "explanation": "## What it does\nChecks for docstrings on class definitions that are preceded by a blank\nline.\n\n## Why is this bad?\nAvoid introducing any blank lines between a class definition and its\ndocstring, for consistency.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, this rule is enabled when using the `google`,\n`numpy`, and `pep257` conventions.\n\nFor an alternative, see [D203].\n\n## Example\n\n```python\nclass PhotoMetadata:\n\n    \"\"\"Metadata about a photo.\"\"\"\n```\n\nUse instead:\n\n```python\nclass PhotoMetadata:\n    \"\"\"Metadata about a photo.\"\"\"\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n[D203]: https://docs.astral.sh/ruff/rules/incorrect-blank-line-before-class\n",
    "fix": 2
  },
  {
    "name": "multi-line-summary-first-line",
    "code": "D212",
    "explanation": "## What it does\nChecks for docstring summary lines that are not positioned on the first\nphysical line of the docstring.\n\n## Why is this bad?\n[PEP 257] recommends that multi-line docstrings consist of \"a summary line\njust like a one-line docstring, followed by a blank line, followed by a\nmore elaborate description.\"\n\nThe summary line should be located on the first physical line of the\ndocstring, immediately after the opening quotes.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, this rule is enabled when using the `google`\nconvention, and disabled when using the `numpy` and `pep257` conventions.\n\nFor an alternative, see [D213].\n\n## Example\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"\n    Return a sorted copy of the list.\n\n    Sort the list in ascending order and return a copy of the result using the\n    bubble sort algorithm.\n    \"\"\"\n```\n\nUse instead:\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"Return a sorted copy of the list.\n\n    Sort the list in ascending order and return a copy of the result using the bubble\n    sort algorithm.\n    \"\"\"\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[D213]: https://docs.astral.sh/ruff/rules/multi-line-summary-second-line\n[PEP 257]: https://peps.python.org/pep-0257\n",
    "fix": 2
  },
  {
    "name": "multi-line-summary-second-line",
    "code": "D213",
    "explanation": "## What it does\nChecks for docstring summary lines that are not positioned on the second\nphysical line of the docstring.\n\n## Why is this bad?\n[PEP 257] recommends that multi-line docstrings consist of \"a summary line\njust like a one-line docstring, followed by a blank line, followed by a\nmore elaborate description.\"\n\nThe summary line should be located on the second physical line of the\ndocstring, immediately after the opening quotes and the blank line.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, this rule is disabled when using the `google`,\n`numpy`, and `pep257` conventions.\n\nFor an alternative, see [D212].\n\n## Example\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"Return a sorted copy of the list.\n\n    Sort the list in ascending order and return a copy of the result using the\n    bubble sort algorithm.\n    \"\"\"\n```\n\nUse instead:\n```python\ndef sort_list(l: list[int]) -> list[int]:\n    \"\"\"\n    Return a sorted copy of the list.\n\n    Sort the list in ascending order and return a copy of the result using the bubble\n    sort algorithm.\n    \"\"\"\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[D212]: https://docs.astral.sh/ruff/rules/multi-line-summary-first-line\n[PEP 257]: https://peps.python.org/pep-0257\n",
    "fix": 2
  },
  {
    "name": "overindented-section",
    "code": "D214",
    "explanation": "## What it does\nChecks for over-indented sections in docstrings.\n\n## Why is this bad?\nThis rule enforces a consistent style for docstrings with multiple\nsections.\n\nMultiline docstrings are typically composed of a summary line, followed by\na blank line, followed by a series of sections, each with a section header\nand a section body. The convention is that all sections should use\nconsistent indentation. In each section, the header should match the\nindentation of the docstring's opening quotes, and the body should be\nindented one level further.\n\nThis rule is enabled when using the `numpy` and `google` conventions, and\ndisabled when using the `pep257` convention.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n        Args:\n            distance: Distance traveled.\n            time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n",
    "fix": 2
  },
  {
    "name": "overindented-section-underline",
    "code": "D215",
    "explanation": "## What it does\nChecks for over-indented section underlines in docstrings.\n\n## Why is this bad?\nThis rule enforces a consistent style for multiline numpy-style docstrings,\nand helps prevent incorrect syntax in docstrings using reStructuredText.\n\nMultiline numpy-style docstrings are typically composed of a summary line,\nfollowed by a blank line, followed by a series of sections. Each section\nhas a section header and a section body, and there should be a series of\nunderline characters in the line following the header. The underline should\nhave the same indentation as the header.\n\nThis rule enforces a consistent style for multiline numpy-style docstrings\nwith sections. If your docstring uses reStructuredText, the rule also\nhelps protect against incorrect reStructuredText syntax, which would cause\nerrors if you tried to use a tool such as Sphinx to generate documentation\nfrom the docstring.\n\nThis rule is enabled when using the `numpy` convention, and disabled when\nusing the `google` or `pep257` conventions.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n        ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n          -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n      ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n",
    "fix": 2
  },
  {
    "name": "triple-single-quotes",
    "code": "D300",
    "explanation": "## What it does\nChecks for docstrings that use `'''triple single quotes'''` instead of\n`\"\"\"triple double quotes\"\"\"`.\n\n## Why is this bad?\n[PEP 257](https://peps.python.org/pep-0257/#what-is-a-docstring) recommends\nthe use of `\"\"\"triple double quotes\"\"\"` for docstrings, to ensure\nconsistency.\n\n## Example\n```python\ndef kos_root():\n    '''Return the pathname of the KOS root directory.'''\n```\n\nUse instead:\n```python\ndef kos_root():\n    \"\"\"Return the pathname of the KOS root directory.\"\"\"\n```\n\n## Formatter compatibility\nWe recommend against using this rule alongside the [formatter]. The\nformatter enforces consistent quotes, making the rule redundant.\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[formatter]: https://docs.astral.sh/ruff/formatter/\n",
    "fix": 1
  },
  {
    "name": "escape-sequence-in-docstring",
    "code": "D301",
    "explanation": "## What it does\nChecks for docstrings that include backslashes, but are not defined as\nraw string literals.\n\n## Why is this bad?\nIn Python, backslashes are typically used to escape characters in strings.\nIn raw strings (those prefixed with an `r`), however, backslashes are\ntreated as literal characters.\n\n[PEP 257](https://peps.python.org/pep-0257/#what-is-a-docstring) recommends\nthe use of raw strings (i.e., `r\"\"\"raw triple double quotes\"\"\"`) for\ndocstrings that include backslashes. The use of a raw string ensures that\nany backslashes are treated as literal characters, and not as escape\nsequences, which avoids confusion.\n\n## Example\n```python\ndef foobar():\n    \"\"\"Docstring for foo\\bar.\"\"\"\n\n\nfoobar.__doc__  # \"Docstring for foar.\"\n```\n\nUse instead:\n```python\ndef foobar():\n    r\"\"\"Docstring for foo\\bar.\"\"\"\n\n\nfoobar.__doc__  # \"Docstring for foo\\bar.\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [Python documentation: String and Bytes literals](https://docs.python.org/3/reference/lexical_analysis.html#string-and-bytes-literals)\n",
    "fix": 1
  },
  {
    "name": "missing-trailing-period",
    "code": "D400",
    "explanation": "## What it does\nChecks for docstrings in which the first line does not end in a period.\n\n## Why is this bad?\n[PEP 257] recommends that the first line of a docstring is written in the\nform of a command, ending in a period.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, this rule is enabled when using the `numpy` and\n`pep257` conventions, and disabled when using the `google` convention.\n\n## Example\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values\"\"\"\n```\n\nUse instead:\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values.\"\"\"\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[PEP 257]: https://peps.python.org/pep-0257/\n",
    "fix": 1
  },
  {
    "name": "non-imperative-mood",
    "code": "D401",
    "explanation": "## What it does\nChecks for docstring first lines that are not in an imperative mood.\n\n## Why is this bad?\n[PEP 257] recommends that the first line of a docstring be written in the\nimperative mood, for consistency.\n\nHint: to rewrite the docstring in the imperative, phrase the first line as\nif it were a command.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, this rule is enabled when using the `numpy` and\n`pep257` conventions, and disabled when using the `google` conventions.\n\n## Example\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Returns the mean of the given values.\"\"\"\n```\n\nUse instead:\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values.\"\"\"\n```\n\n## Options\n- `lint.pydocstyle.convention`\n- `lint.pydocstyle.property-decorators`\n- `lint.pydocstyle.ignore-decorators`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n\n[PEP 257]: https://peps.python.org/pep-0257/\n"
  },
  {
    "name": "signature-in-docstring",
    "code": "D402",
    "explanation": "## What it does\nChecks for function docstrings that include the function's signature in\nthe summary line.\n\n## Why is this bad?\n[PEP 257] recommends against including a function's signature in its\ndocstring. Instead, consider using type annotations as a form of\ndocumentation for the function's parameters and return value.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, this rule is enabled when using the `google` and\n`pep257` conventions, and disabled when using the `numpy` convention.\n\n## Example\n```python\ndef foo(a, b):\n    \"\"\"foo(a: int, b: int) -> list[int]\"\"\"\n```\n\nUse instead:\n```python\ndef foo(a: int, b: int) -> list[int]:\n    \"\"\"Return a list of a and b.\"\"\"\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n\n[PEP 257]: https://peps.python.org/pep-0257/\n"
  },
  {
    "name": "first-word-uncapitalized",
    "code": "D403",
    "explanation": "## What it does\nChecks for docstrings that do not start with a capital letter.\n\n## Why is this bad?\nThe first non-whitespace character in a docstring should be\ncapitalized for grammatical correctness and consistency.\n\n## Example\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"return the mean of the given values.\"\"\"\n```\n\nUse instead:\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values.\"\"\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n",
    "fix": 2
  },
  {
    "name": "docstring-starts-with-this",
    "code": "D404",
    "explanation": "## What it does\nChecks for docstrings that start with `This`.\n\n## Why is this bad?\n[PEP 257] recommends that the first line of a docstring be written in the\nimperative mood, for consistency.\n\nHint: to rewrite the docstring in the imperative, phrase the first line as\nif it were a command.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, this rule is enabled when using the `numpy`\nconvention,, and disabled when using the `google` and `pep257` conventions.\n\n## Example\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"This function returns the mean of the given values.\"\"\"\n```\n\nUse instead:\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values.\"\"\"\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n\n[PEP 257]: https://peps.python.org/pep-0257/\n"
  },
  {
    "name": "non-capitalized-section-name",
    "code": "D405",
    "explanation": "## What it does\nChecks for section headers in docstrings that do not begin with capital\nletters.\n\n## Why is this bad?\nFor stylistic consistency, all section headers in a docstring should be\ncapitalized.\n\nMultiline docstrings are typically composed of a summary line, followed by\na blank line, followed by a series of sections. Each section typically has\na header and a body.\n\nThis rule is enabled when using the `numpy` and `google` conventions, and\ndisabled when using the `pep257` convention.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    returns:\n        Speed as distance divided by time.\n\n    raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n",
    "fix": 2
  },
  {
    "name": "missing-new-line-after-section-name",
    "code": "D406",
    "explanation": "## What it does\nChecks for section headers in docstrings that are followed by non-newline\ncharacters.\n\n## Why is this bad?\nThis rule enforces a consistent style for multiline numpy-style docstrings.\n\nMultiline numpy-style docstrings are typically composed of a summary line,\nfollowed by a blank line, followed by a series of sections. Each section\nhas a section header and a section body. The section header should be\nfollowed by a newline, rather than by some other character (like a colon).\n\nThis rule is enabled when using the `numpy` convention, and disabled\nwhen using the `google` or `pep257` conventions.\n\n## Example\n```python\n# The `Parameters`, `Returns` and `Raises` section headers are all followed\n# by a colon in this function's docstring:\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters:\n    -----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns:\n    --------\n    float\n        Speed as distance divided by time.\n\n    Raises:\n    -------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n",
    "fix": 2
  },
  {
    "name": "missing-dashed-underline-after-section",
    "code": "D407",
    "explanation": "## What it does\nChecks for section headers in docstrings that are not followed by\nunderlines.\n\n## Why is this bad?\nThis rule enforces a consistent style for multiline numpy-style docstrings,\nand helps prevent incorrect syntax in docstrings using reStructuredText.\n\nMultiline numpy-style docstrings are typically composed of a summary line,\nfollowed by a blank line, followed by a series of sections. Each section\nhas a section header and a section body, and the header should be followed\nby a series of underline characters in the following line.\n\nThis rule enforces a consistent style for multiline numpy-style docstrings\nwith sections. If your docstring uses reStructuredText, the rule also\nhelps protect against incorrect reStructuredText syntax, which would cause\nerrors if you tried to use a tool such as Sphinx to generate documentation\nfrom the docstring.\n\nThis rule is enabled when using the `numpy` convention, and disabled\nwhen using the `google` or `pep257` conventions.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n\n    float\n        Speed as distance divided by time.\n\n    Raises\n\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n",
    "fix": 2
  },
  {
    "name": "missing-section-underline-after-name",
    "code": "D408",
    "explanation": "## What it does\nChecks for section underlines in docstrings that are not on the line\nimmediately following the section name.\n\n## Why is this bad?\nThis rule enforces a consistent style for multiline numpy-style docstrings,\nand helps prevent incorrect syntax in docstrings using reStructuredText.\n\nMultiline numpy-style docstrings are typically composed of a summary line,\nfollowed by a blank line, followed by a series of sections. Each section\nhas a header and a body. There should be a series of underline characters\nin the line immediately below the header.\n\nThis rule enforces a consistent style for multiline numpy-style docstrings\nwith sections. If your docstring uses reStructuredText, the rule also\nhelps protect against incorrect reStructuredText syntax, which would cause\nerrors if you tried to use a tool such as Sphinx to generate documentation\nfrom the docstring.\n\nThis rule is enabled when using the `numpy` convention, and disabled\nwhen using the `google` or `pep257` conventions.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n",
    "fix": 2
  },
  {
    "name": "mismatched-section-underline-length",
    "code": "D409",
    "explanation": "## What it does\nChecks for section underlines in docstrings that do not match the length of\nthe corresponding section header.\n\n## Why is this bad?\nThis rule enforces a consistent style for multiline numpy-style docstrings,\nand helps prevent incorrect syntax in docstrings using reStructuredText.\n\nMultiline numpy-style docstrings are typically composed of a summary line,\nfollowed by a blank line, followed by a series of sections. Each section\nhas a section header and a section body, and there should be a series of\nunderline characters in the line following the header. The length of the\nunderline should exactly match the length of the section header.\n\nThis rule enforces a consistent style for multiline numpy-style docstrings\nwith sections. If your docstring uses reStructuredText, the rule also\nhelps protect against incorrect reStructuredText syntax, which would cause\nerrors if you tried to use a tool such as Sphinx to generate documentation\nfrom the docstring.\n\nThis rule is enabled when using the `numpy` convention, and disabled\nwhen using the `google` or `pep257` conventions.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ---\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    ---\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ---\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n",
    "fix": 2
  },
  {
    "name": "no-blank-line-after-section",
    "code": "D410",
    "explanation": "## What it does\nChecks for docstring sections that are not separated by a single blank\nline.\n\n## Why is this bad?\nThis rule enforces consistency in your docstrings, and helps ensure\ncompatibility with documentation tooling.\n\nMultiline docstrings are typically composed of a summary line, followed by\na blank line, followed by a series of sections, each with a section header\nand a section body. If a multiline numpy-style or Google-style docstring\nconsists of multiple sections, each section should be separated by a single\nblank line.\n\nThis rule is enabled when using the `numpy` and `google` conventions, and\ndisabled when using the `pep257` convention.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Style Guide](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n",
    "fix": 2
  },
  {
    "name": "no-blank-line-before-section",
    "code": "D411",
    "explanation": "## What it does\nChecks for docstring sections that are not separated by a blank line.\n\n## Why is this bad?\nThis rule enforces consistency in numpy-style and Google-style docstrings,\nand helps ensure compatibility with documentation tooling.\n\nMultiline docstrings are typically composed of a summary line, followed by\na blank line, followed by a series of sections, each with a section header\nand a section body. Sections should be separated by a single blank line.\n\nThis rule is enabled when using the `numpy` and `google` conventions, and\ndisabled when using the `pep257` convention.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n",
    "fix": 2
  },
  {
    "name": "blank-lines-between-header-and-content",
    "code": "D412",
    "explanation": "## What it does\nChecks for docstring sections that contain blank lines between a section\nheader and a section body.\n\n## Why is this bad?\nThis rule enforces a consistent style for multiline docstrings.\n\nMultiline docstrings are typically composed of a summary line, followed by\na blank line, followed by a series of sections, each with a section header\nand a section body. There should be no blank lines between a section header\nand a section body.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n",
    "fix": 2
  },
  {
    "name": "missing-blank-line-after-last-section",
    "code": "D413",
    "explanation": "## What it does\nChecks for missing blank lines after the last section of a multiline\ndocstring.\n\n## Why is this bad?\nThis rule enforces a consistent style for multiline docstrings.\n\nMultiline docstrings are typically composed of a summary line, followed by\na blank line, followed by a series of sections, each with a section header\nand a section body.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, the rule is disabled when using the `google`,\n`numpy`, and `pep257` conventions.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n",
    "fix": 2
  },
  {
    "name": "empty-docstring-section",
    "code": "D414",
    "explanation": "## What it does\nChecks for docstrings with empty sections.\n\n## Why is this bad?\nAn empty section in a multiline docstring likely indicates an unfinished\nor incomplete docstring.\n\nMultiline docstrings are typically composed of a summary line, followed by\na blank line, followed by a series of sections, each with a section header\nand a section body. Each section body should be non-empty; empty sections\nshould either have content added to them, or be removed entirely.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Parameters\n    ----------\n    distance : float\n        Distance traveled.\n    time : float\n        Time spent traveling.\n\n    Returns\n    -------\n    float\n        Speed as distance divided by time.\n\n    Raises\n    ------\n    FasterThanLightError\n        If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Style Guide](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n"
  },
  {
    "name": "missing-terminal-punctuation",
    "code": "D415",
    "explanation": "## What it does\nChecks for docstrings in which the first line does not end in a punctuation\nmark, such as a period, question mark, or exclamation point.\n\n## Why is this bad?\nThe first line of a docstring should end with a period, question mark, or\nexclamation point, for grammatical correctness and consistency.\n\nThis rule may not apply to all projects; its applicability is a matter of\nconvention. By default, this rule is enabled when using the `google`\nconvention, and disabled when using the `numpy` and `pep257` conventions.\n\n## Example\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values\"\"\"\n```\n\nUse instead:\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values.\"\"\"\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n",
    "fix": 1
  },
  {
    "name": "missing-section-name-colon",
    "code": "D416",
    "explanation": "## What it does\nChecks for docstring section headers that do not end with a colon.\n\n## Why is this bad?\nThis rule enforces a consistent style for multiline Google-style\ndocstrings. If a multiline Google-style docstring consists of multiple\nsections, each section header should end with a colon.\n\nMultiline docstrings are typically composed of a summary line, followed by\na blank line, followed by a series of sections, each with a section header\nand a section body.\n\nThis rule is enabled when using the `google` convention, and disabled when\nusing the `pep257` and `numpy` conventions.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns\n        Speed as distance divided by time.\n\n    Raises\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [Google Style Guide](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n",
    "fix": 2
  },
  {
    "name": "undocumented-param",
    "code": "D417",
    "explanation": "## What it does\nChecks for function docstrings that do not include documentation for all\nparameters in the function.\n\n## Why is this bad?\nThis rule helps prevent you from leaving Google-style docstrings unfinished\nor incomplete. Multiline Google-style docstrings should describe all\nparameters for the function they are documenting.\n\nMultiline docstrings are typically composed of a summary line, followed by\na blank line, followed by a series of sections, each with a section header\nand a section body. Function docstrings often include a section for\nfunction arguments; this rule is concerned with that section only.\nNote that this rule only checks docstrings with an arguments (e.g. `Args`) section.\n\nThis rule is enabled when using the `google` convention, and disabled when\nusing the `pep257` and `numpy` conventions.\n\n## Example\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\nUse instead:\n```python\ndef calculate_speed(distance: float, time: float) -> float:\n    \"\"\"Calculate speed as distance divided by time.\n\n    Args:\n        distance: Distance traveled.\n        time: Time spent traveling.\n\n    Returns:\n        Speed as distance divided by time.\n\n    Raises:\n        FasterThanLightError: If speed is greater than the speed of light.\n    \"\"\"\n    try:\n        return distance / time\n    except ZeroDivisionError as exc:\n        raise FasterThanLightError from exc\n```\n\n## Options\n- `lint.pydocstyle.convention`\n- `lint.pydocstyle.ignore-var-parameters`\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [PEP 287 \u2013 reStructuredText Docstring Format](https://peps.python.org/pep-0287/)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n"
  },
  {
    "name": "overload-with-docstring",
    "code": "D418",
    "explanation": "## What it does\nChecks for `@overload` function definitions that contain a docstring.\n\n## Why is this bad?\nThe `@overload` decorator is used to define multiple compatible signatures\nfor a given function, to support type-checking. A series of `@overload`\ndefinitions should be followed by a single non-decorated definition that\ncontains the implementation of the function.\n\n`@overload` function definitions should not contain a docstring; instead,\nthe docstring should be placed on the non-decorated definition that contains\nthe implementation.\n\n## Example\n\n```python\nfrom typing import overload\n\n\n@overload\ndef factorial(n: int) -> int:\n    \"\"\"Return the factorial of n.\"\"\"\n\n\n@overload\ndef factorial(n: float) -> float:\n    \"\"\"Return the factorial of n.\"\"\"\n\n\ndef factorial(n):\n    \"\"\"Return the factorial of n.\"\"\"\n\n\nfactorial.__doc__  # \"Return the factorial of n.\"\n```\n\nUse instead:\n\n```python\nfrom typing import overload\n\n\n@overload\ndef factorial(n: int) -> int: ...\n\n\n@overload\ndef factorial(n: float) -> float: ...\n\n\ndef factorial(n):\n    \"\"\"Return the factorial of n.\"\"\"\n\n\nfactorial.__doc__  # \"Return the factorial of n.\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [Python documentation: `typing.overload`](https://docs.python.org/3/library/typing.html#typing.overload)\n"
  },
  {
    "name": "empty-docstring",
    "code": "D419",
    "explanation": "## What it does\nChecks for empty docstrings.\n\n## Why is this bad?\nAn empty docstring is indicative of incomplete documentation. It should either\nbe removed or replaced with a meaningful docstring.\n\n## Example\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"\"\"\"\n```\n\nUse instead:\n```python\ndef average(values: list[float]) -> float:\n    \"\"\"Return the mean of the given values.\"\"\"\n```\n\n## References\n- [PEP 257 \u2013 Docstring Conventions](https://peps.python.org/pep-0257/)\n- [NumPy Style Guide](https://numpydoc.readthedocs.io/en/latest/format.html)\n- [Google Python Style Guide - Docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)\n"
  },
  {
    "name": "unused-import",
    "code": "F401",
    "explanation": "## What it does\nChecks for unused imports.\n\n## Why is this bad?\nUnused imports add a performance overhead at runtime, and risk creating\nimport cycles. They also increase the cognitive load of reading the code.\n\nIf an import statement is used to check for the availability or existence\nof a module, consider using `importlib.util.find_spec` instead.\n\nIf an import statement is used to re-export a symbol as part of a module's\npublic interface, consider using a \"redundant\" import alias, which\ninstructs Ruff (and other tools) to respect the re-export, and avoid\nmarking it as unused, as in:\n\n```python\nfrom module import member as member\n```\n\nAlternatively, you can use `__all__` to declare a symbol as part of the module's\ninterface, as in:\n\n```python\n# __init__.py\nimport some_module\n\n__all__ = [\"some_module\"]\n```\n\n## Fix safety\n\nFixes to remove unused imports are safe, except in `__init__.py` files.\n\nApplying fixes to `__init__.py` files is currently in preview. The fix offered depends on the\ntype of the unused import. Ruff will suggest a safe fix to export first-party imports with\neither a redundant alias or, if already present in the file, an `__all__` entry. If multiple\n`__all__` declarations are present, Ruff will not offer a fix. Ruff will suggest an unsafe fix\nto remove third-party and standard library imports -- the fix is unsafe because the module's\ninterface changes.\n\n## Example\n\n```python\nimport numpy as np  # unused import\n\n\ndef area(radius):\n    return 3.14 * radius**2\n```\n\nUse instead:\n\n```python\ndef area(radius):\n    return 3.14 * radius**2\n```\n\nTo check the availability of a module, use `importlib.util.find_spec`:\n\n```python\nfrom importlib.util import find_spec\n\nif find_spec(\"numpy\") is not None:\n    print(\"numpy is installed\")\nelse:\n    print(\"numpy is not installed\")\n```\n\n## Options\n- `lint.ignore-init-module-imports`\n- `lint.pyflakes.allowed-unused-imports`\n\n## References\n- [Python documentation: `import`](https://docs.python.org/3/reference/simple_stmts.html#the-import-statement)\n- [Python documentation: `importlib.util.find_spec`](https://docs.python.org/3/library/importlib.html#importlib.util.find_spec)\n- [Typing documentation: interface conventions](https://typing.readthedocs.io/en/latest/source/libraries.html#library-interface-public-and-private-symbols)\n",
    "fix": 1
  },
  {
    "name": "import-shadowed-by-loop-var",
    "code": "F402",
    "explanation": "## What it does\nChecks for import bindings that are shadowed by loop variables.\n\n## Why is this bad?\nShadowing an import with loop variables makes the code harder to read and\nreason about, as the identify of the imported binding is no longer clear.\nIt's also often indicative of a mistake, as it's unlikely that the loop\nvariable is intended to be used as the imported binding.\n\nConsider using a different name for the loop variable.\n\n## Example\n```python\nfrom os import path\n\nfor path in files:\n    print(path)\n```\n\nUse instead:\n```python\nfrom os import path\n\n\nfor filename in files:\n    print(filename)\n```\n"
  },
  {
    "name": "undefined-local-with-import-star",
    "code": "F403",
    "explanation": "## What it does\nChecks for the use of wildcard imports.\n\n## Why is this bad?\nWildcard imports (e.g., `from module import *`) make it hard to determine\nwhich symbols are available in the current namespace, and from which module\nthey were imported. They're also discouraged by [PEP 8].\n\n## Example\n```python\nfrom math import *\n\n\ndef area(radius):\n    return pi * radius**2\n```\n\nUse instead:\n```python\nfrom math import pi\n\n\ndef area(radius):\n    return pi * radius**2\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#imports\n"
  },
  {
    "name": "late-future-import",
    "code": "F404",
    "explanation": "## What it does\nChecks for `__future__` imports that are not located at the beginning of a\nfile.\n\n## Why is this bad?\nImports from `__future__` must be placed the beginning of the file, before any\nother statements (apart from docstrings). The use of `__future__` imports\nelsewhere is invalid and will result in a `SyntaxError`.\n\n## Example\n```python\nfrom pathlib import Path\n\nfrom __future__ import annotations\n```\n\nUse instead:\n```python\nfrom __future__ import annotations\n\nfrom pathlib import Path\n```\n\n## References\n- [Python documentation: Future statements](https://docs.python.org/3/reference/simple_stmts.html#future)\n"
  },
  {
    "name": "undefined-local-with-import-star-usage",
    "code": "F405",
    "explanation": "## What it does\nChecks for names that might be undefined, but may also be defined in a\nwildcard import.\n\n## Why is this bad?\nWildcard imports (e.g., `from module import *`) make it hard to determine\nwhich symbols are available in the current namespace. If a module contains\na wildcard import, and a name in the current namespace has not been\nexplicitly defined or imported, then it's unclear whether the name is\nundefined or was imported by the wildcard import.\n\nIf the name _is_ defined in via a wildcard import, that member should be\nimported explicitly to avoid confusion.\n\nIf the name is _not_ defined in a wildcard import, it should be defined or\nimported.\n\n## Example\n```python\nfrom math import *\n\n\ndef area(radius):\n    return pi * radius**2\n```\n\nUse instead:\n```python\nfrom math import pi\n\n\ndef area(radius):\n    return pi * radius**2\n```\n"
  },
  {
    "name": "undefined-local-with-nested-import-star-usage",
    "code": "F406",
    "explanation": "## What it does\nCheck for the use of wildcard imports outside of the module namespace.\n\n## Why is this bad?\nThe use of wildcard imports outside of the module namespace (e.g., within\nfunctions) can lead to confusion, as the import can shadow local variables.\n\nThough wildcard imports are discouraged by [PEP 8], when necessary, they\nshould be placed in the module namespace (i.e., at the top-level of a\nmodule).\n\n## Example\n\n```python\ndef foo():\n    from math import *\n```\n\nUse instead:\n\n```python\nfrom math import *\n\n\ndef foo(): ...\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#imports\n"
  },
  {
    "name": "future-feature-not-defined",
    "code": "F407",
    "explanation": "## What it does\nChecks for `__future__` imports that are not defined in the current Python\nversion.\n\n## Why is this bad?\nImporting undefined or unsupported members from the `__future__` module is\na `SyntaxError`.\n\n## References\n- [Python documentation: `__future__`](https://docs.python.org/3/library/__future__.html)\n"
  },
  {
    "name": "percent-format-invalid-format",
    "code": "F501",
    "explanation": "## What it does\nChecks for invalid `printf`-style format strings.\n\n## Why is this bad?\nConversion specifiers are required for `printf`-style format strings. These\nspecifiers must contain a `%` character followed by a conversion type.\n\n## Example\n```python\n\"Hello, %\" % \"world\"\n```\n\nUse instead:\n```python\n\"Hello, %s\" % \"world\"\n```\n\n## References\n- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)\n"
  },
  {
    "name": "percent-format-expected-mapping",
    "code": "F502",
    "explanation": "## What it does\nChecks for named placeholders in `printf`-style format strings without\nmapping-type values.\n\n## Why is this bad?\nWhen using named placeholders in `printf`-style format strings, the values\nmust be a map type (such as a dictionary). Otherwise, the expression will\nraise a `TypeError`.\n\n## Example\n```python\n\"%(greeting)s, %(name)s\" % (\"Hello\", \"World\")\n```\n\nUse instead:\n```python\n\"%(greeting)s, %(name)s\" % {\"greeting\": \"Hello\", \"name\": \"World\"}\n```\n\nOr:\n```python\n\"%s, %s\" % (\"Hello\", \"World\")\n```\n\n## References\n- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)\n"
  },
  {
    "name": "percent-format-expected-sequence",
    "code": "F503",
    "explanation": "## What it does\nChecks for uses of mapping-type values in `printf`-style format strings\nwithout named placeholders.\n\n## Why is this bad?\nWhen using mapping-type values (such as `dict`) in `printf`-style format\nstrings, the keys must be named. Otherwise, the expression will raise a\n`TypeError`.\n\n## Example\n```python\n\"%s, %s\" % {\"greeting\": \"Hello\", \"name\": \"World\"}\n```\n\nUse instead:\n```python\n\"%(greeting)s, %(name)s\" % {\"greeting\": \"Hello\", \"name\": \"World\"}\n```\n\nOr:\n```python\n\"%s, %s\" % (\"Hello\", \"World\")\n```\n\n## References\n- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)\n"
  },
  {
    "name": "percent-format-extra-named-arguments",
    "code": "F504",
    "explanation": "## What it does\nChecks for unused mapping keys in `printf`-style format strings.\n\n## Why is this bad?\nUnused named placeholders in `printf`-style format strings are unnecessary,\nand likely indicative of a mistake. They should be removed.\n\n## Example\n```python\n\"Hello, %(name)s\" % {\"greeting\": \"Hello\", \"name\": \"World\"}\n```\n\nUse instead:\n```python\n\"Hello, %(name)s\" % {\"name\": \"World\"}\n```\n\n## References\n- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)\n",
    "fix": 2
  },
  {
    "name": "percent-format-missing-argument",
    "code": "F505",
    "explanation": "## What it does\nChecks for named placeholders in `printf`-style format strings that are not\npresent in the provided mapping.\n\n## Why is this bad?\nNamed placeholders that lack a corresponding value in the provided mapping\nwill raise a `KeyError`.\n\n## Example\n```python\n\"%(greeting)s, %(name)s\" % {\"name\": \"world\"}\n```\n\nUse instead:\n```python\n\"Hello, %(name)s\" % {\"name\": \"world\"}\n```\n\n## References\n- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)\n"
  },
  {
    "name": "percent-format-mixed-positional-and-named",
    "code": "F506",
    "explanation": "## What it does\nChecks for `printf`-style format strings that have mixed positional and\nnamed placeholders.\n\n## Why is this bad?\nPython does not support mixing positional and named placeholders in\n`printf`-style format strings. The use of mixed placeholders will raise a\n`TypeError` at runtime.\n\n## Example\n```python\n\"%s, %(name)s\" % (\"Hello\", {\"name\": \"World\"})\n```\n\nUse instead:\n```python\n\"%s, %s\" % (\"Hello\", \"World\")\n```\n\nOr:\n```python\n\"%(greeting)s, %(name)s\" % {\"greeting\": \"Hello\", \"name\": \"World\"}\n```\n\n## References\n- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)\n"
  },
  {
    "name": "percent-format-positional-count-mismatch",
    "code": "F507",
    "explanation": "## What it does\nChecks for `printf`-style format strings that have a mismatch between the\nnumber of positional placeholders and the number of substitution values.\n\n## Why is this bad?\nWhen a `printf`-style format string is provided with too many or too few\nsubstitution values, it will raise a `TypeError` at runtime.\n\n## Example\n```python\n\"%s, %s\" % (\"Hello\", \"world\", \"!\")\n```\n\nUse instead:\n```python\n\"%s, %s\" % (\"Hello\", \"world\")\n```\n\n## References\n- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)\n"
  },
  {
    "name": "percent-format-star-requires-sequence",
    "code": "F508",
    "explanation": "## What it does\nChecks for `printf`-style format strings that use the `*` specifier with\nnon-tuple values.\n\n## Why is this bad?\nThe use of the `*` specifier with non-tuple values will raise a\n`TypeError` at runtime.\n\n## Example\n```python\nfrom math import pi\n\n\"%(n).*f\" % {\"n\": (2, pi)}\n```\n\nUse instead:\n```python\nfrom math import pi\n\n\"%.*f\" % (2, pi)  # 3.14\n```\n\n## References\n- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)\n"
  },
  {
    "name": "percent-format-unsupported-format-character",
    "code": "F509",
    "explanation": "## What it does\nChecks for `printf`-style format strings with invalid format characters.\n\n## Why is this bad?\nIn `printf`-style format strings, the `%` character is used to indicate\nplaceholders. If a `%` character is not followed by a valid format\ncharacter, it will raise a `ValueError` at runtime.\n\n## Example\n```python\n\"Hello, %S\" % \"world\"\n```\n\nUse instead:\n```python\n\"Hello, %s\" % \"world\"\n```\n\n## References\n- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#printf-style-string-formatting)\n"
  },
  {
    "name": "string-dot-format-invalid-format",
    "code": "F521",
    "explanation": "## What it does\nChecks for `str.format` calls with invalid format strings.\n\n## Why is this bad?\nInvalid format strings will raise a `ValueError`.\n\n## Example\n```python\n\"{\".format(foo)\n```\n\nUse instead:\n```python\n\"{}\".format(foo)\n```\n\n## References\n- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)\n"
  },
  {
    "name": "string-dot-format-extra-named-arguments",
    "code": "F522",
    "explanation": "## What it does\nChecks for `str.format` calls with unused keyword arguments.\n\n## Why is this bad?\nUnused keyword arguments are redundant, and often indicative of a mistake.\nThey should be removed.\n\n## Example\n```python\n\"Hello, {name}\".format(greeting=\"Hello\", name=\"World\")\n```\n\nUse instead:\n```python\n\"Hello, {name}\".format(name=\"World\")\n```\n\n## References\n- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)\n",
    "fix": 1
  },
  {
    "name": "string-dot-format-extra-positional-arguments",
    "code": "F523",
    "explanation": "## What it does\nChecks for `str.format` calls with unused positional arguments.\n\n## Why is this bad?\nUnused positional arguments are redundant, and often indicative of a mistake.\nThey should be removed.\n\n## Example\n```python\n\"Hello, {0}\".format(\"world\", \"!\")\n```\n\nUse instead:\n```python\n\"Hello, {0}\".format(\"world\")\n```\n\n## References\n- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)\n",
    "fix": 1
  },
  {
    "name": "string-dot-format-missing-arguments",
    "code": "F524",
    "explanation": "## What it does\nChecks for `str.format` calls with placeholders that are missing arguments.\n\n## Why is this bad?\nIn `str.format` calls, omitting arguments for placeholders will raise a\n`KeyError` at runtime.\n\n## Example\n```python\n\"{greeting}, {name}\".format(name=\"World\")\n```\n\nUse instead:\n```python\n\"{greeting}, {name}\".format(greeting=\"Hello\", name=\"World\")\n```\n\n## References\n- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)\n"
  },
  {
    "name": "string-dot-format-mixing-automatic",
    "code": "F525",
    "explanation": "## What it does\nChecks for `str.format` calls that mix automatic and manual numbering.\n\n## Why is this bad?\nIn `str.format` calls, mixing automatic and manual numbering will raise a\n`ValueError` at runtime.\n\n## Example\n```python\n\"{0}, {}\".format(\"Hello\", \"World\")\n```\n\nUse instead:\n```python\n\"{0}, {1}\".format(\"Hello\", \"World\")\n```\n\nOr:\n```python\n\"{}, {}\".format(\"Hello\", \"World\")\n```\n\n## References\n- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)\n"
  },
  {
    "name": "f-string-missing-placeholders",
    "code": "F541",
    "explanation": "## What it does\nChecks for f-strings that do not contain any placeholder expressions.\n\n## Why is this bad?\nf-strings are a convenient way to format strings, but they are not\nnecessary if there are no placeholder expressions to format. In this\ncase, a regular string should be used instead, as an f-string without\nplaceholders can be confusing for readers, who may expect such a\nplaceholder to be present.\n\nAn f-string without any placeholders could also indicate that the\nauthor forgot to add a placeholder expression.\n\n## Example\n```python\nf\"Hello, world!\"\n```\n\nUse instead:\n```python\n\"Hello, world!\"\n```\n\n**Note:** to maintain compatibility with PyFlakes, this rule only flags\nf-strings that are part of an implicit concatenation if _none_ of the\nf-string segments contain placeholder expressions.\n\nFor example:\n\n```python\n# Will not be flagged.\n(\n    f\"Hello,\"\n    f\" {name}!\"\n)\n\n# Will be flagged.\n(\n    f\"Hello,\"\n    f\" World!\"\n)\n```\n\nSee [#10885](https://github.com/astral-sh/ruff/issues/10885) for more.\n\n## References\n- [PEP 498 \u2013 Literal String Interpolation](https://peps.python.org/pep-0498/)\n",
    "fix": 2
  },
  {
    "name": "multi-value-repeated-key-literal",
    "code": "F601",
    "explanation": "## What it does\nChecks for dictionary literals that associate multiple values with the\nsame key.\n\n## Why is this bad?\nDictionary keys should be unique. If a key is associated with multiple values,\nthe earlier values will be overwritten. Including multiple values for the\nsame key in a dictionary literal is likely a mistake.\n\n## Example\n```python\nfoo = {\n    \"bar\": 1,\n    \"baz\": 2,\n    \"baz\": 3,\n}\nfoo[\"baz\"]  # 3\n```\n\nUse instead:\n```python\nfoo = {\n    \"bar\": 1,\n    \"baz\": 2,\n}\nfoo[\"baz\"]  # 2\n```\n\n## References\n- [Python documentation: Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)\n",
    "fix": 1
  },
  {
    "name": "multi-value-repeated-key-variable",
    "code": "F602",
    "explanation": "## What it does\nChecks for dictionary keys that are repeated with different values.\n\n## Why is this bad?\nDictionary keys should be unique. If a key is repeated with a different\nvalue, the first values will be overwritten and the key will correspond to\nthe last value. This is likely a mistake.\n\n## Example\n```python\nfoo = {\n    bar: 1,\n    baz: 2,\n    baz: 3,\n}\nfoo[baz]  # 3\n```\n\nUse instead:\n```python\nfoo = {\n    bar: 1,\n    baz: 2,\n}\nfoo[baz]  # 2\n```\n\n## References\n- [Python documentation: Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)\n",
    "fix": 1
  },
  {
    "name": "expressions-in-star-assignment",
    "code": "F621",
    "explanation": "## What it does\nChecks for the use of too many expressions in starred assignment statements.\n\n## Why is this bad?\nIn assignment statements, starred expressions can be used to unpack iterables.\n\nIn Python 3, no more than 1 << 8 assignments are allowed before a starred\nexpression, and no more than 1 << 24 expressions are allowed after a starred\nexpression.\n\n## References\n- [PEP 3132 \u2013 Extended Iterable Unpacking](https://peps.python.org/pep-3132/)\n"
  },
  {
    "name": "multiple-starred-expressions",
    "code": "F622",
    "explanation": "## What it does\nChecks for the use of multiple starred expressions in assignment statements.\n\n## Why is this bad?\nIn assignment statements, starred expressions can be used to unpack iterables.\nIncluding more than one starred expression on the left-hand-side of an\nassignment will cause a `SyntaxError`, as it is unclear which expression\nshould receive the remaining values.\n\n## Example\n```python\n*foo, *bar, baz = (1, 2, 3)\n```\n\n## References\n- [PEP 3132 \u2013 Extended Iterable Unpacking](https://peps.python.org/pep-3132/)\n"
  },
  {
    "name": "assert-tuple",
    "code": "F631",
    "explanation": "## What it does\nChecks for `assert` statements that use non-empty tuples as test\nconditions.\n\n## Why is this bad?\nNon-empty tuples are always `True`, so an `assert` statement with a\nnon-empty tuple as its test condition will always pass. This is likely a\nmistake.\n\n## Example\n```python\nassert (some_condition,)\n```\n\nUse instead:\n```python\nassert some_condition\n```\n\n## References\n- [Python documentation: The `assert` statement](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)\n"
  },
  {
    "name": "is-literal",
    "code": "F632",
    "explanation": "## What it does\nChecks for `is` and `is not` comparisons against literals, like integers,\nstrings, or lists.\n\n## Why is this bad?\nThe `is` and `is not` comparators operate on identity, in that they check\nwhether two objects are the same object. If the objects are not the same\nobject, the comparison will always be `False`. Using `is` and `is not` with\nconstant literals often works \"by accident\", but are not guaranteed to produce\nthe expected result.\n\nAs of Python 3.8, using `is` and `is not` with constant literals will produce\na `SyntaxWarning`.\n\nThis rule will also flag `is` and `is not` comparisons against non-constant\nliterals, like lists, sets, and dictionaries. While such comparisons will\nnot raise a `SyntaxWarning`, they are still likely to be incorrect, as they\nwill compare the identities of the objects instead of their values, which\nwill always evaluate to `False`.\n\nInstead, use `==` and `!=` to compare literals, which will compare the\nvalues of the objects instead of their identities.\n\n## Example\n```python\nx = 200\nif x is 200:\n    print(\"It's 200!\")\n```\n\nUse instead:\n```python\nx = 200\nif x == 200:\n    print(\"It's 200!\")\n```\n\n## References\n- [Python documentation: Identity comparisons](https://docs.python.org/3/reference/expressions.html#is-not)\n- [Python documentation: Value comparisons](https://docs.python.org/3/reference/expressions.html#value-comparisons)\n- [_Why does Python log a SyntaxWarning for \u2018is\u2019 with literals?_ by Adam Johnson](https://adamj.eu/tech/2020/01/21/why-does-python-3-8-syntaxwarning-for-is-literal/)\n",
    "fix": 2
  },
  {
    "name": "invalid-print-syntax",
    "code": "F633",
    "explanation": "## What it does\nChecks for `print` statements that use the `>>` syntax.\n\n## Why is this bad?\nIn Python 2, the `print` statement can be used with the `>>` syntax to\nprint to a file-like object. This `print >> sys.stderr` syntax no\nlonger exists in Python 3, where `print` is only a function, not a\nstatement.\n\nInstead, use the `file` keyword argument to the `print` function, the\n`sys.stderr.write` function, or the `logging` module.\n\n## Example\n```python\nfrom __future__ import print_function\nimport sys\n\nprint >> sys.stderr, \"Hello, world!\"\n```\n\nUse instead:\n```python\nprint(\"Hello, world!\", file=sys.stderr)\n```\n\nOr:\n```python\nimport sys\n\nsys.stderr.write(\"Hello, world!\\n\")\n```\n\nOr:\n```python\nimport logging\n\nlogging.error(\"Hello, world!\")\n```\n\n## References\n- [Python documentation: `print`](https://docs.python.org/3/library/functions.html#print)\n"
  },
  {
    "name": "if-tuple",
    "code": "F634",
    "explanation": "## What it does\nChecks for `if` statements that use non-empty tuples as test conditions.\n\n## Why is this bad?\nNon-empty tuples are always `True`, so an `if` statement with a non-empty\ntuple as its test condition will always pass. This is likely a mistake.\n\n## Example\n```python\nif (False,):\n    print(\"This will always run\")\n```\n\nUse instead:\n```python\nif False:\n    print(\"This will never run\")\n```\n\n## References\n- [Python documentation: The `if` statement](https://docs.python.org/3/reference/compound_stmts.html#the-if-statement)\n"
  },
  {
    "name": "break-outside-loop",
    "code": "F701",
    "explanation": "## What it does\nChecks for `break` statements outside of loops.\n\n## Why is this bad?\nThe use of a `break` statement outside of a `for` or `while` loop will\nraise a `SyntaxError`.\n\n## Example\n```python\ndef foo():\n    break\n```\n\n## References\n- [Python documentation: `break`](https://docs.python.org/3/reference/simple_stmts.html#the-break-statement)\n"
  },
  {
    "name": "continue-outside-loop",
    "code": "F702",
    "explanation": "## What it does\nChecks for `continue` statements outside of loops.\n\n## Why is this bad?\nThe use of a `continue` statement outside of a `for` or `while` loop will\nraise a `SyntaxError`.\n\n## Example\n```python\ndef foo():\n    continue  # SyntaxError\n```\n\n## References\n- [Python documentation: `continue`](https://docs.python.org/3/reference/simple_stmts.html#the-continue-statement)\n"
  },
  {
    "name": "yield-outside-function",
    "code": "F704",
    "explanation": "## What it does\nChecks for `yield`, `yield from`, and `await` usages outside of functions.\n\n## Why is this bad?\nThe use of `yield`, `yield from`, or `await` outside of a function will\nraise a `SyntaxError`.\n\n## Example\n```python\nclass Foo:\n    yield 1\n```\n\n## Notebook behavior\nAs an exception, `await` is allowed at the top level of a Jupyter notebook\n(see: [autoawait]).\n\n## References\n- [Python documentation: `yield`](https://docs.python.org/3/reference/simple_stmts.html#the-yield-statement)\n\n[autoawait]: https://ipython.readthedocs.io/en/stable/interactive/autoawait.html\n"
  },
  {
    "name": "return-outside-function",
    "code": "F706",
    "explanation": "## What it does\nChecks for `return` statements outside of functions.\n\n## Why is this bad?\nThe use of a `return` statement outside of a function will raise a\n`SyntaxError`.\n\n## Example\n```python\nclass Foo:\n    return 1\n```\n\n## References\n- [Python documentation: `return`](https://docs.python.org/3/reference/simple_stmts.html#the-return-statement)\n"
  },
  {
    "name": "default-except-not-last",
    "code": "F707",
    "explanation": "## What it does\nChecks for `except` blocks that handle all exceptions, but are not the last\n`except` block in a `try` statement.\n\n## Why is this bad?\nWhen an exception is raised within a `try` block, the `except` blocks are\nevaluated in order, and the first matching block is executed. If an `except`\nblock handles all exceptions, but isn't the last block, Python will raise a\n`SyntaxError`, as the following blocks would never be executed.\n\n## Example\n```python\ndef reciprocal(n):\n    try:\n        reciprocal = 1 / n\n    except:\n        print(\"An exception occurred.\")\n    except ZeroDivisionError:\n        print(\"Cannot divide by zero.\")\n    else:\n        return reciprocal\n```\n\nUse instead:\n```python\ndef reciprocal(n):\n    try:\n        reciprocal = 1 / n\n    except ZeroDivisionError:\n        print(\"Cannot divide by zero.\")\n    except:\n        print(\"An exception occurred.\")\n    else:\n        return reciprocal\n```\n\n## References\n- [Python documentation: `except` clause](https://docs.python.org/3/reference/compound_stmts.html#except-clause)\n"
  },
  {
    "name": "forward-annotation-syntax-error",
    "code": "F722",
    "explanation": "## What it does\nChecks for forward annotations that include invalid syntax.\n\n\n## Why is this bad?\nIn Python, type annotations can be quoted as strings literals to enable\nreferences to types that have not yet been defined, known as \"forward\nreferences\".\n\nHowever, these quoted annotations must be valid Python expressions. The use\nof invalid syntax in a quoted annotation won't raise a `SyntaxError`, but\nwill instead raise an error when type checking is performed.\n\n## Example\n\n```python\ndef foo() -> \"/\": ...\n```\n\n## References\n- [PEP 563 \u2013 Postponed Evaluation of Annotations](https://peps.python.org/pep-0563/)\n"
  },
  {
    "name": "redefined-while-unused",
    "code": "F811",
    "explanation": "## What it does\nChecks for variable definitions that redefine (or \"shadow\") unused\nvariables.\n\n## Why is this bad?\nRedefinitions of unused names are unnecessary and often indicative of a\nmistake.\n\n## Example\n```python\nimport foo\nimport bar\nimport foo  # Redefinition of unused `foo` from line 1\n```\n\nUse instead:\n```python\nimport foo\nimport bar\n```\n",
    "fix": 1
  },
  {
    "name": "undefined-name",
    "code": "F821",
    "explanation": "## What it does\nChecks for uses of undefined names.\n\n## Why is this bad?\nAn undefined name is likely to raise `NameError` at runtime.\n\n## Example\n```python\ndef double():\n    return n * 2  # raises `NameError` if `n` is undefined when `double` is called\n```\n\nUse instead:\n```python\ndef double(n):\n    return n * 2\n```\n\n## Options\n- [`target-version`]: Can be used to configure which symbols Ruff will understand\n  as being available in the `builtins` namespace.\n\n## References\n- [Python documentation: Naming and binding](https://docs.python.org/3/reference/executionmodel.html#naming-and-binding)\n"
  },
  {
    "name": "undefined-export",
    "code": "F822",
    "explanation": "## What it does\nChecks for undefined names in `__all__`.\n\n## Why is this bad?\nIn Python, the `__all__` variable is used to define the names that are\nexported when a module is imported as a wildcard (e.g.,\n`from foo import *`). The names in `__all__` must be defined in the module,\nbut are included as strings.\n\nIncluding an undefined name in `__all__` is likely to raise `NameError` at\nruntime, when the module is imported.\n\nIn [preview], this rule will flag undefined names in `__init__.py` file,\neven if those names implicitly refer to other modules in the package. Users\nthat rely on implicit exports should disable this rule in `__init__.py`\nfiles via [`lint.per-file-ignores`].\n\n## Example\n```python\nfrom foo import bar\n\n\n__all__ = [\"bar\", \"baz\"]  # undefined name `baz` in `__all__`\n```\n\nUse instead:\n```python\nfrom foo import bar, baz\n\n\n__all__ = [\"bar\", \"baz\"]\n```\n\n## References\n- [Python documentation: `__all__`](https://docs.python.org/3/tutorial/modules.html#importing-from-a-package)\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "undefined-local",
    "code": "F823",
    "explanation": "## What it does\nChecks for undefined local variables.\n\n## Why is this bad?\nReferencing a local variable before it has been assigned will raise\nan `UnboundLocalError` at runtime.\n\n## Example\n```python\nx = 1\n\n\ndef foo():\n    x += 1\n```\n\nUse instead:\n```python\nx = 1\n\n\ndef foo():\n    global x\n    x += 1\n```\n"
  },
  {
    "name": "unused-variable",
    "code": "F841",
    "explanation": "## What it does\nChecks for the presence of unused variables in function scopes.\n\n## Why is this bad?\nA variable that is defined but not used is likely a mistake, and should\nbe removed to avoid confusion.\n\nIf a variable is intentionally defined-but-not-used, it should be\nprefixed with an underscore, or some other value that adheres to the\n[`lint.dummy-variable-rgx`] pattern.\n\n## Example\n```python\ndef foo():\n    x = 1\n    y = 2\n    return x\n```\n\nUse instead:\n```python\ndef foo():\n    x = 1\n    return x\n```\n\n## Options\n- `lint.dummy-variable-rgx`\n",
    "fix": 1
  },
  {
    "name": "unused-annotation",
    "code": "F842",
    "explanation": "## What it does\nChecks for local variables that are annotated but never used.\n\n## Why is this bad?\nAnnotations are used to provide type hints to static type checkers. If a\nvariable is annotated but never used, the annotation is unnecessary.\n\n## Example\n```python\ndef foo():\n    bar: int\n```\n\n## References\n- [PEP 484 \u2013 Type Hints](https://peps.python.org/pep-0484/)\n"
  },
  {
    "name": "raise-not-implemented",
    "code": "F901",
    "explanation": "## What it does\nChecks for `raise` statements that raise `NotImplemented`.\n\n## Why is this bad?\n`NotImplemented` is an exception used by binary special methods to indicate\nthat an operation is not implemented with respect to a particular type.\n\n`NotImplemented` should not be raised directly. Instead, raise\n`NotImplementedError`, which is used to indicate that the method is\nabstract or not implemented in the derived class.\n\n## Example\n```python\nclass Foo:\n    def bar(self):\n        raise NotImplemented\n```\n\nUse instead:\n```python\nclass Foo:\n    def bar(self):\n        raise NotImplementedError\n```\n\n## References\n- [Python documentation: `NotImplemented`](https://docs.python.org/3/library/constants.html#NotImplemented)\n- [Python documentation: `NotImplementedError`](https://docs.python.org/3/library/exceptions.html#NotImplementedError)\n",
    "fix": 1
  },
  {
    "name": "eval",
    "code": "PGH001",
    "explanation": "## Removed\nThis rule is identical to [S307] which should be used instead.\n\n## What it does\nChecks for uses of the builtin `eval()` function.\n\n## Why is this bad?\nThe `eval()` function is insecure as it enables arbitrary code execution.\n\n## Example\n```python\ndef foo():\n    x = eval(input(\"Enter a number: \"))\n    ...\n```\n\nUse instead:\n```python\ndef foo():\n    x = input(\"Enter a number: \")\n    ...\n```\n\n## References\n- [Python documentation: `eval`](https://docs.python.org/3/library/functions.html#eval)\n- [_Eval really is dangerous_ by Ned Batchelder](https://nedbatchelder.com/blog/201206/eval_really_is_dangerous.html)\n\n[S307]: https://docs.astral.sh/ruff/rules/suspicious-eval-usage/\n"
  },
  {
    "name": "deprecated-log-warn",
    "code": "PGH002",
    "explanation": "## Removed\nThis rule is identical to [G010] which should be used instead.\n\n## What it does\nCheck for usages of the deprecated `warn` method from the `logging` module.\n\n## Why is this bad?\nThe `warn` method is deprecated. Use `warning` instead.\n\n## Example\n```python\nimport logging\n\n\ndef foo():\n    logging.warn(\"Something happened\")\n```\n\nUse instead:\n```python\nimport logging\n\n\ndef foo():\n    logging.warning(\"Something happened\")\n```\n\n## References\n- [Python documentation: `logger.Logger.warning`](https://docs.python.org/3/library/logging.html#logging.Logger.warning)\n\n[G010]: https://docs.astral.sh/ruff/rules/logging-warn/\n",
    "fix": 1
  },
  {
    "name": "blanket-type-ignore",
    "code": "PGH003",
    "explanation": "## What it does\nCheck for `type: ignore` annotations that suppress all type warnings, as\nopposed to targeting specific type warnings.\n\n## Why is this bad?\nSuppressing all warnings can hide issues in the code.\n\nBlanket `type: ignore` annotations are also more difficult to interpret and\nmaintain, as the annotation does not clarify which warnings are intended\nto be suppressed.\n\n## Example\n```python\nfrom foo import secrets  # type: ignore\n```\n\nUse instead:\n```python\nfrom foo import secrets  # type: ignore[attr-defined]\n```\n\n## References\nMypy supports a [built-in setting](https://mypy.readthedocs.io/en/stable/error_code_list2.html#check-that-type-ignore-include-an-error-code-ignore-without-code)\nto enforce that all `type: ignore` annotations include an error code, akin\nto enabling this rule:\n```toml\n[tool.mypy]\nenable_error_code = [\"ignore-without-code\"]\n```\n"
  },
  {
    "name": "blanket-noqa",
    "code": "PGH004",
    "explanation": "## What it does\nCheck for `noqa` annotations that suppress all diagnostics, as opposed to\ntargeting specific diagnostics.\n\n## Why is this bad?\nSuppressing all diagnostics can hide issues in the code.\n\nBlanket `noqa` annotations are also more difficult to interpret and\nmaintain, as the annotation does not clarify which diagnostics are intended\nto be suppressed.\n\n## Example\n```python\nfrom .base import *  # noqa\n```\n\nUse instead:\n```python\nfrom .base import *  # noqa: F403\n```\n\n## Fix safety\nThis rule will attempt to fix blanket `noqa` annotations that appear to\nbe unintentional. For example, given `# noqa F401`, the rule will suggest\ninserting a colon, as in `# noqa: F401`.\n\nWhile modifying `noqa` comments is generally safe, doing so may introduce\nadditional diagnostics.\n\n## References\n- [Ruff documentation](https://docs.astral.sh/ruff/configuration/#error-suppression)\n",
    "fix": 1
  },
  {
    "name": "invalid-mock-access",
    "code": "PGH005",
    "explanation": "## What it does\nChecks for common mistakes when using mock objects.\n\n## Why is this bad?\nThe `mock` module exposes an assertion API that can be used to verify that\nmock objects undergo expected interactions. This rule checks for common\nmistakes when using this API.\n\nFor example, it checks for mock attribute accesses that should be replaced\nwith mock method calls.\n\n## Example\n```python\nmy_mock.assert_called\n```\n\nUse instead:\n```python\nmy_mock.assert_called()\n```\n"
  },
  {
    "name": "type-name-incorrect-variance",
    "code": "PLC0105",
    "explanation": "## What it does\nChecks for type names that do not match the variance of their associated\ntype parameter.\n\n## Why is this bad?\n[PEP 484] recommends the use of the `_co` and `_contra` suffixes for\ncovariant and contravariant type parameters, respectively (while invariant\ntype parameters should not have any such suffix).\n\n## Example\n```python\nfrom typing import TypeVar\n\nT = TypeVar(\"T\", covariant=True)\nU = TypeVar(\"U\", contravariant=True)\nV_co = TypeVar(\"V_co\")\n```\n\nUse instead:\n```python\nfrom typing import TypeVar\n\nT_co = TypeVar(\"T_co\", covariant=True)\nU_contra = TypeVar(\"U_contra\", contravariant=True)\nV = TypeVar(\"V\")\n```\n\n## References\n- [Python documentation: `typing` \u2014 Support for type hints](https://docs.python.org/3/library/typing.html)\n- [PEP 483 \u2013 The Theory of Type Hints: Covariance and Contravariance](https://peps.python.org/pep-0483/#covariance-and-contravariance)\n- [PEP 484 \u2013 Type Hints: Covariance and contravariance](https://peps.python.org/pep-0484/#covariance-and-contravariance)\n\n[PEP 484]: https://peps.python.org/pep-0484/\n"
  },
  {
    "name": "type-bivariance",
    "code": "PLC0131",
    "explanation": "## What it does\nChecks for `TypeVar` and `ParamSpec` definitions in which the type is\nboth covariant and contravariant.\n\n## Why is this bad?\nBy default, Python's generic types are invariant, but can be marked as\neither covariant or contravariant via the `covariant` and `contravariant`\nkeyword arguments. While the API does allow you to mark a type as both\ncovariant and contravariant, this is not supported by the type system,\nand should be avoided.\n\nInstead, change the variance of the type to be either covariant,\ncontravariant, or invariant. If you want to describe both covariance and\ncontravariance, consider using two separate type parameters.\n\nFor context: an \"invariant\" generic type only accepts values that exactly\nmatch the type parameter; for example, `list[Dog]` accepts only `list[Dog]`,\nnot `list[Animal]` (superclass) or `list[Bulldog]` (subclass). This is\nthe default behavior for Python's generic types.\n\nA \"covariant\" generic type accepts subclasses of the type parameter; for\nexample, `Sequence[Animal]` accepts `Sequence[Dog]`. A \"contravariant\"\ngeneric type accepts superclasses of the type parameter; for example,\n`Callable[Dog]` accepts `Callable[Animal]`.\n\n## Example\n```python\nfrom typing import TypeVar\n\nT = TypeVar(\"T\", covariant=True, contravariant=True)\n```\n\nUse instead:\n```python\nfrom typing import TypeVar\n\nT_co = TypeVar(\"T_co\", covariant=True)\nT_contra = TypeVar(\"T_contra\", contravariant=True)\n```\n\n## References\n- [Python documentation: `typing` \u2014 Support for type hints](https://docs.python.org/3/library/typing.html)\n- [PEP 483 \u2013 The Theory of Type Hints: Covariance and Contravariance](https://peps.python.org/pep-0483/#covariance-and-contravariance)\n- [PEP 484 \u2013 Type Hints: Covariance and contravariance](https://peps.python.org/pep-0484/#covariance-and-contravariance)\n"
  },
  {
    "name": "type-param-name-mismatch",
    "code": "PLC0132",
    "explanation": "## What it does\nChecks for `TypeVar`, `TypeVarTuple`, `ParamSpec`, and `NewType`\ndefinitions in which the name of the type parameter does not match the name\nof the variable to which it is assigned.\n\n## Why is this bad?\nWhen defining a `TypeVar` or a related type parameter, Python allows you to\nprovide a name for the type parameter. According to [PEP 484], the name\nprovided to the `TypeVar` constructor must be equal to the name of the\nvariable to which it is assigned.\n\n## Example\n```python\nfrom typing import TypeVar\n\nT = TypeVar(\"U\")\n```\n\nUse instead:\n```python\nfrom typing import TypeVar\n\nT = TypeVar(\"T\")\n```\n\n## References\n- [Python documentation: `typing` \u2014 Support for type hints](https://docs.python.org/3/library/typing.html)\n- [PEP 484 \u2013 Type Hints: Generics](https://peps.python.org/pep-0484/#generics)\n\n[PEP 484]:https://peps.python.org/pep-0484/#generics\n"
  },
  {
    "name": "single-string-slots",
    "code": "PLC0205",
    "explanation": "## What it does\nChecks for single strings assigned to `__slots__`.\n\n## Why is this bad?\nIn Python, the `__slots__` attribute allows you to explicitly define the\nattributes (instance variables) that a class can have. By default, Python\nuses a dictionary to store an object's attributes, which incurs some memory\noverhead. However, when `__slots__` is defined, Python uses a more compact\ninternal structure to store the object's attributes, resulting in memory\nsavings.\n\nAny string iterable may be assigned to `__slots__` (most commonly, a\n`tuple` of strings). If a string is assigned to `__slots__`, it is\ninterpreted as a single attribute name, rather than an iterable of attribute\nnames. This can cause confusion, as users that iterate over the `__slots__`\nvalue may expect to iterate over a sequence of attributes, but would instead\niterate over the characters of the string.\n\nTo use a single string attribute in `__slots__`, wrap the string in an\niterable container type, like a `tuple`.\n\n## Example\n```python\nclass Person:\n    __slots__: str = \"name\"\n\n    def __init__(self, name: str) -> None:\n        self.name = name\n```\n\nUse instead:\n```python\nclass Person:\n    __slots__: tuple[str, ...] = (\"name\",)\n\n    def __init__(self, name: str) -> None:\n        self.name = name\n```\n\n## References\n- [Python documentation: `__slots__`](https://docs.python.org/3/reference/datamodel.html#slots)\n"
  },
  {
    "name": "dict-index-missing-items",
    "code": "PLC0206",
    "explanation": "## What it does\nChecks for dictionary iterations that extract the dictionary value\nvia explicit indexing, instead of using `.items()`.\n\n## Why is this bad?\nIterating over a dictionary with `.items()` is semantically clearer\nand more efficient than extracting the value with the key.\n\n## Example\n```python\nORCHESTRA = {\n    \"violin\": \"strings\",\n    \"oboe\": \"woodwind\",\n    \"tuba\": \"brass\",\n    \"gong\": \"percussion\",\n}\n\nfor instrument in ORCHESTRA:\n    print(f\"{instrument}: {ORCHESTRA[instrument]}\")\n```\n\nUse instead:\n```python\nORCHESTRA = {\n    \"violin\": \"strings\",\n    \"oboe\": \"woodwind\",\n    \"tuba\": \"brass\",\n    \"gong\": \"percussion\",\n}\n\nfor instrument, section in ORCHESTRA.items():\n    print(f\"{instrument}: {section}\")\n```\n"
  },
  {
    "name": "iteration-over-set",
    "code": "PLC0208",
    "explanation": "## What it does\nChecks for iteration over a `set` literal where each element in the set is\nitself a literal value.\n\n## Why is this bad?\nIterating over a `set` is less efficient than iterating over a sequence\ntype, like `list` or `tuple`.\n\n## Example\n```python\nfor number in {1, 2, 3}:\n    ...\n```\n\nUse instead:\n```python\nfor number in (1, 2, 3):\n    ...\n```\n\n## References\n- [Python documentation: `set`](https://docs.python.org/3/library/stdtypes.html#set)\n",
    "fix": 2
  },
  {
    "name": "useless-import-alias",
    "code": "PLC0414",
    "explanation": "## What it does\nChecks for import aliases that do not rename the original package.\n\n## Why is this bad?\nThe import alias is redundant and should be removed to avoid confusion.\n\n## Example\n```python\nimport numpy as numpy\n```\n\nUse instead:\n```python\nimport numpy as np\n```\n\nor\n\n```python\nimport numpy\n```\n",
    "fix": 1
  },
  {
    "name": "import-outside-top-level",
    "code": "PLC0415",
    "explanation": "## What it does\nChecks for `import` statements outside of a module's top-level scope, such\nas within a function or class definition.\n\n## Why is this bad?\n[PEP 8] recommends placing imports not only at the top-level of a module,\nbut at the very top of the file, \"just after any module comments and\ndocstrings, and before module globals and constants.\"\n\n`import` statements have effects that are global in scope; defining them at\nthe top level has a number of benefits. For example, it makes it easier to\nidentify the dependencies of a module, and ensures that any invalid imports\nare caught regardless of whether a specific function is called or class is\ninstantiated.\n\nAn import statement would typically be placed within a function only to\navoid a circular dependency, to defer a costly module load, or to avoid\nloading a dependency altogether in a certain runtime environment.\n\n## Example\n```python\ndef print_python_version():\n    import platform\n\n    print(python.python_version())\n```\n\nUse instead:\n```python\nimport platform\n\n\ndef print_python_version():\n    print(python.python_version())\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#imports\n",
    "preview": true
  },
  {
    "name": "len-test",
    "code": "PLC1802",
    "explanation": "## What it does\nChecks for `len` calls on sequences in a boolean test context.\n\n## Why is this bad?\nEmpty sequences are considered false in a boolean context.\nYou can either remove the call to `len`\nor compare the length against a scalar.\n\n## Example\n```python\nfruits = [\"orange\", \"apple\"]\nvegetables = []\n\nif len(fruits):\n    print(fruits)\n\nif not len(vegetables):\n    print(vegetables)\n```\n\nUse instead:\n```python\nfruits = [\"orange\", \"apple\"]\n\nif fruits:\n    print(fruits)\n\nif not vegetables:\n    print(vegetables)\n```\n\n## References\n[PEP 8: Programming Recommendations](https://peps.python.org/pep-0008/#programming-recommendations)\n",
    "fix": 2
  },
  {
    "name": "compare-to-empty-string",
    "code": "PLC1901",
    "explanation": "## What it does\nChecks for comparisons to empty strings.\n\n## Why is this bad?\nAn empty string is falsy, so it is unnecessary to compare it to `\"\"`. If\nthe value can be something else Python considers falsy, such as `None`,\n`0`, or another empty container, then the code is not equivalent.\n\n## Known problems\nHigh false positive rate, as the check is context-insensitive and does not\nconsider the type of the variable being compared ([#4282]).\n\n## Example\n```python\nx: str = ...\n\nif x == \"\":\n    print(\"x is empty\")\n```\n\nUse instead:\n```python\nx: str = ...\n\nif not x:\n    print(\"x is empty\")\n```\n\n## References\n- [Python documentation: Truth Value Testing](https://docs.python.org/3/library/stdtypes.html#truth-value-testing)\n\n[#4282]: https://github.com/astral-sh/ruff/issues/4282\n",
    "preview": true
  },
  {
    "name": "non-ascii-name",
    "code": "PLC2401",
    "explanation": "## What it does\nChecks for the use of non-ASCII characters in variable names.\n\n## Why is this bad?\nThe use of non-ASCII characters in variable names can cause confusion\nand compatibility issues (see: [PEP 672]).\n\n## Example\n```python\n\u00e1pple_count: int\n```\n\nUse instead:\n```python\napple_count: int\n```\n\n[PEP 672]: https://peps.python.org/pep-0672/\n"
  },
  {
    "name": "non-ascii-import-name",
    "code": "PLC2403",
    "explanation": "## What it does\nChecks for the use of non-ASCII characters in import statements.\n\n## Why is this bad?\nThe use of non-ASCII characters in import statements can cause confusion\nand compatibility issues (see: [PEP 672]).\n\n## Example\n```python\nimport b\u00e1r\n```\n\nUse instead:\n```python\nimport bar\n```\n\nIf the module is third-party, use an ASCII-only alias:\n```python\nimport b\u00e1r as bar\n```\n\n[PEP 672]: https://peps.python.org/pep-0672/\n"
  },
  {
    "name": "import-private-name",
    "code": "PLC2701",
    "explanation": "## What it does\nChecks for import statements that import a private name (a name starting\nwith an underscore `_`) from another module.\n\n## Why is this bad?\n[PEP 8] states that names starting with an underscore are private. Thus,\nthey are not intended to be used outside of the module in which they are\ndefined.\n\nFurther, as private imports are not considered part of the public API, they\nare prone to unexpected changes, especially outside of semantic versioning.\n\nInstead, consider using the public API of the module.\n\nThis rule ignores private name imports that are exclusively used in type\nannotations. Ideally, types would be public; however, this is not always\npossible when using third-party libraries.\n\n## Known problems\nDoes not ignore private name imports from within the module that defines\nthe private name if the module is defined with [PEP 420] namespace packages\n(i.e., directories that omit the `__init__.py` file). Namespace packages\nmust be configured via the [`namespace-packages`] setting.\n\n## Example\n```python\nfrom foo import _bar\n```\n\n## Options\n- `namespace-packages`\n\n## References\n- [PEP 8: Naming Conventions](https://peps.python.org/pep-0008/#naming-conventions)\n- [Semantic Versioning](https://semver.org/)\n\n[PEP 8]: https://peps.python.org/pep-0008/\n[PEP 420]: https://peps.python.org/pep-0420/\n",
    "preview": true
  },
  {
    "name": "unnecessary-dunder-call",
    "code": "PLC2801",
    "explanation": "## What it does\nChecks for explicit use of dunder methods, like `__str__` and `__add__`.\n\n## Why is this bad?\nDunder names are not meant to be called explicitly and, in most cases, can\nbe replaced with builtins or operators.\n\n## Example\n```python\nthree = (3.0).__str__()\ntwelve = \"1\".__add__(\"2\")\n\n\ndef is_greater_than_two(x: int) -> bool:\n    return x.__gt__(2)\n```\n\nUse instead:\n```python\nthree = str(3.0)\ntwelve = \"1\" + \"2\"\n\n\ndef is_greater_than_two(x: int) -> bool:\n    return x > 2\n```\n\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "unnecessary-direct-lambda-call",
    "code": "PLC3002",
    "explanation": "## What it does\nChecks for unnecessary direct calls to lambda expressions.\n\n## Why is this bad?\nCalling a lambda expression directly is unnecessary. The expression can be\nexecuted inline instead to improve readability.\n\n## Example\n```python\narea = (lambda r: 3.14 * r**2)(radius)\n```\n\nUse instead:\n```python\narea = 3.14 * radius**2\n```\n\n## References\n- [Python documentation: Lambdas](https://docs.python.org/3/reference/expressions.html#lambda)\n"
  },
  {
    "name": "yield-in-init",
    "code": "PLE0100",
    "explanation": "## What it does\nChecks for `__init__` methods that are turned into generators by the\ninclusion of `yield` or `yield from` expressions.\n\n## Why is this bad?\nThe `__init__` method is the constructor for a given Python class,\nresponsible for initializing, rather than creating, new objects.\n\nThe `__init__` method has to return `None`. By including a `yield` or\n`yield from` expression in an `__init__`, the method will return a\ngenerator object when called at runtime, resulting in a runtime error.\n\n## Example\n```python\nclass InitIsGenerator:\n    def __init__(self, i):\n        yield i\n```\n\n## References\n- [CodeQL: `py-init-method-is-generator`](https://codeql.github.com/codeql-query-help/python/py-init-method-is-generator/)\n"
  },
  {
    "name": "return-in-init",
    "code": "PLE0101",
    "explanation": "## What it does\nChecks for `__init__` methods that return values.\n\n## Why is this bad?\nThe `__init__` method is the constructor for a given Python class,\nresponsible for initializing, rather than creating, new objects.\n\nThe `__init__` method has to return `None`. Returning any value from\nan `__init__` method will result in a runtime error.\n\n## Example\n```python\nclass Example:\n    def __init__(self):\n        return []\n```\n\nUse instead:\n```python\nclass Example:\n    def __init__(self):\n        self.value = []\n```\n\n## References\n- [CodeQL: `py-explicit-return-in-init`](https://codeql.github.com/codeql-query-help/python/py-explicit-return-in-init/)\n"
  },
  {
    "name": "nonlocal-and-global",
    "code": "PLE0115",
    "explanation": "## What it does\nChecks for variables which are both declared as both `nonlocal` and\n`global`.\n\n## Why is this bad?\nA `nonlocal` variable is a variable that is defined in the nearest\nenclosing scope, but not in the global scope, while a `global` variable is\na variable that is defined in the global scope.\n\nDeclaring a variable as both `nonlocal` and `global` is contradictory and\nwill raise a `SyntaxError`.\n\n## Example\n```python\ncounter = 0\n\n\ndef increment():\n    global counter\n    nonlocal counter\n    counter += 1\n```\n\nUse instead:\n```python\ncounter = 0\n\n\ndef increment():\n    global counter\n    counter += 1\n```\n\n## References\n- [Python documentation: The `global` statement](https://docs.python.org/3/reference/simple_stmts.html#the-global-statement)\n- [Python documentation: The `nonlocal` statement](https://docs.python.org/3/reference/simple_stmts.html#nonlocal)\n"
  },
  {
    "name": "continue-in-finally",
    "code": "PLE0116",
    "explanation": "## What it does\nChecks for `continue` statements inside `finally`\n\n## Why is this bad?\n`continue` statements were not allowed within `finally` clauses prior to\nPython 3.8. Using a `continue` statement within a `finally` clause can\ncause a `SyntaxError`.\n\n## Example\n```python\nwhile True:\n    try:\n        pass\n    finally:\n        continue\n```\n\nUse instead:\n```python\nwhile True:\n    try:\n        pass\n    except Exception:\n        pass\n    else:\n        continue\n```\n\n## Options\n- `target-version`\n"
  },
  {
    "name": "nonlocal-without-binding",
    "code": "PLE0117",
    "explanation": "## What it does\nChecks for `nonlocal` names without bindings.\n\n## Why is this bad?\n`nonlocal` names must be bound to a name in an outer scope.\nViolating this rule leads to a `SyntaxError` at runtime.\n\n## Example\n```python\ndef foo():\n    def get_bar(self):\n        nonlocal bar\n        ...\n```\n\nUse instead:\n```python\ndef foo():\n    bar = 1\n\n    def get_bar(self):\n        nonlocal bar\n        ...\n```\n\n## References\n- [Python documentation: The `nonlocal` statement](https://docs.python.org/3/reference/simple_stmts.html#nonlocal)\n- [PEP 3104 \u2013 Access to Names in Outer Scopes](https://peps.python.org/pep-3104/)\n"
  },
  {
    "name": "load-before-global-declaration",
    "code": "PLE0118",
    "explanation": "## What it does\nChecks for uses of names that are declared as `global` prior to the\nrelevant `global` declaration.\n\n## Why is this bad?\nThe `global` declaration applies to the entire scope. Using a name that's\ndeclared as `global` in a given scope prior to the relevant `global`\ndeclaration is a `SyntaxError`.\n\n## Example\n```python\ncounter = 1\n\n\ndef increment():\n    print(f\"Adding 1 to {counter}\")\n    global counter\n    counter += 1\n```\n\nUse instead:\n```python\ncounter = 1\n\n\ndef increment():\n    global counter\n    print(f\"Adding 1 to {counter}\")\n    counter += 1\n```\n\n## References\n- [Python documentation: The `global` statement](https://docs.python.org/3/reference/simple_stmts.html#the-global-statement)\n"
  },
  {
    "name": "non-slot-assignment",
    "code": "PLE0237",
    "explanation": "## What it does\nChecks for assignments to attributes that are not defined in `__slots__`.\n\n## Why is this bad?\nWhen using `__slots__`, only the specified attributes are allowed.\nAttempting to assign to an attribute that is not defined in `__slots__`\nwill result in an `AttributeError` at runtime.\n\n## Known problems\nThis rule can't detect `__slots__` implementations in superclasses, and\nso limits its analysis to classes that inherit from (at most) `object`.\n\n## Example\n```python\nclass Student:\n    __slots__ = (\"name\",)\n\n    def __init__(self, name, surname):\n        self.name = name\n        self.surname = surname  # [assigning-non-slot]\n        self.setup()\n\n    def setup(self):\n        pass\n```\n\nUse instead:\n```python\nclass Student:\n    __slots__ = (\"name\", \"surname\")\n\n    def __init__(self, name, surname):\n        self.name = name\n        self.surname = surname\n        self.setup()\n\n    def setup(self):\n        pass\n```\n"
  },
  {
    "name": "duplicate-bases",
    "code": "PLE0241",
    "explanation": "## What it does\nChecks for duplicate base classes in class definitions.\n\n## Why is this bad?\nIncluding duplicate base classes will raise a `TypeError` at runtime.\n\n## Example\n```python\nclass Foo:\n    pass\n\n\nclass Bar(Foo, Foo):\n    pass\n```\n\nUse instead:\n```python\nclass Foo:\n    pass\n\n\nclass Bar(Foo):\n    pass\n```\n\n## References\n- [Python documentation: Class definitions](https://docs.python.org/3/reference/compound_stmts.html#class-definitions)\n",
    "fix": 1
  },
  {
    "name": "unexpected-special-method-signature",
    "code": "PLE0302",
    "explanation": "## What it does\nChecks for \"special\" methods that have an unexpected method signature.\n\n## Why is this bad?\n\"Special\" methods, like `__len__`, are expected to adhere to a specific,\nstandard function signature. Implementing a \"special\" method using a\nnon-standard function signature can lead to unexpected and surprising\nbehavior for users of a given class.\n\n## Example\n```python\nclass Bookshelf:\n    def __init__(self):\n        self._books = [\"Foo\", \"Bar\", \"Baz\"]\n\n    def __len__(self, index):  # __len__ does not except an index parameter\n        return len(self._books)\n\n    def __getitem__(self, index):\n        return self._books[index]\n```\n\nUse instead:\n```python\nclass Bookshelf:\n    def __init__(self):\n        self._books = [\"Foo\", \"Bar\", \"Baz\"]\n\n    def __len__(self):\n        return len(self._books)\n\n    def __getitem__(self, index):\n        return self._books[index]\n```\n\n## References\n- [Python documentation: Data model](https://docs.python.org/3/reference/datamodel.html)\n"
  },
  {
    "name": "invalid-length-return-type",
    "code": "PLE0303",
    "explanation": "## What it does\nChecks for `__len__` implementations that return values that are not non-negative\nintegers.\n\n## Why is this bad?\nThe `__len__` method should return a non-negative integer. Returning a different\nvalue may cause unexpected behavior.\n\nNote: `bool` is a subclass of `int`, so it's technically valid for `__len__` to\nreturn `True` or `False`. However, for consistency with other rules, Ruff will\nstill emit a diagnostic when `__len__` returns a `bool`.\n\n## Example\n```python\nclass Foo:\n    def __len__(self):\n        return \"2\"\n```\n\nUse instead:\n```python\nclass Foo:\n    def __len__(self):\n        return 2\n```\n\n## References\n- [Python documentation: The `__len__` method](https://docs.python.org/3/reference/datamodel.html#object.__len__)\n"
  },
  {
    "name": "invalid-bool-return-type",
    "code": "PLE0304",
    "explanation": "## What it does\nChecks for `__bool__` implementations that return a type other than `bool`.\n\n## Why is this bad?\nThe `__bool__` method should return a `bool` object. Returning a different\ntype may cause unexpected behavior.\n\n## Example\n```python\nclass Foo:\n    def __bool__(self):\n        return 2\n```\n\nUse instead:\n```python\nclass Foo:\n    def __bool__(self):\n        return True\n```\n\n## References\n- [Python documentation: The `__bool__` method](https://docs.python.org/3/reference/datamodel.html#object.__bool__)\n",
    "preview": true
  },
  {
    "name": "invalid-index-return-type",
    "code": "PLE0305",
    "explanation": "## What it does\nChecks for `__index__` implementations that return non-integer values.\n\n## Why is this bad?\nThe `__index__` method should return an integer. Returning a different\ntype may cause unexpected behavior.\n\nNote: `bool` is a subclass of `int`, so it's technically valid for `__index__` to\nreturn `True` or `False`. However, a `DeprecationWarning` (`DeprecationWarning:\n__index__ returned non-int (type bool)`) for such cases was already introduced,\nthus this is a conscious difference between the original pylint rule and the\ncurrent ruff implementation.\n\n## Example\n```python\nclass Foo:\n    def __index__(self):\n        return \"2\"\n```\n\nUse instead:\n```python\nclass Foo:\n    def __index__(self):\n        return 2\n```\n\n## References\n- [Python documentation: The `__index__` method](https://docs.python.org/3/reference/datamodel.html#object.__index__)\n"
  },
  {
    "name": "invalid-str-return-type",
    "code": "PLE0307",
    "explanation": "## What it does\nChecks for `__str__` implementations that return a type other than `str`.\n\n## Why is this bad?\nThe `__str__` method should return a `str` object. Returning a different\ntype may cause unexpected behavior.\n\n## Example\n```python\nclass Foo:\n    def __str__(self):\n        return True\n```\n\nUse instead:\n```python\nclass Foo:\n    def __str__(self):\n        return \"Foo\"\n```\n\n## References\n- [Python documentation: The `__str__` method](https://docs.python.org/3/reference/datamodel.html#object.__str__)\n"
  },
  {
    "name": "invalid-bytes-return-type",
    "code": "PLE0308",
    "explanation": "## What it does\nChecks for `__bytes__` implementations that return types other than `bytes`.\n\n## Why is this bad?\nThe `__bytes__` method should return a `bytes` object. Returning a different\ntype may cause unexpected behavior.\n\n## Example\n```python\nclass Foo:\n    def __bytes__(self):\n        return 2\n```\n\nUse instead:\n```python\nclass Foo:\n    def __bytes__(self):\n        return b\"2\"\n```\n\n## References\n- [Python documentation: The `__bytes__` method](https://docs.python.org/3/reference/datamodel.html#object.__bytes__)\n"
  },
  {
    "name": "invalid-hash-return-type",
    "code": "PLE0309",
    "explanation": "## What it does\nChecks for `__hash__` implementations that return non-integer values.\n\n## Why is this bad?\nThe `__hash__` method should return an integer. Returning a different\ntype may cause unexpected behavior.\n\nNote: `bool` is a subclass of `int`, so it's technically valid for `__hash__` to\nreturn `True` or `False`. However, for consistency with other rules, Ruff will\nstill emit a diagnostic when `__hash__` returns a `bool`.\n\n## Example\n```python\nclass Foo:\n    def __hash__(self):\n        return \"2\"\n```\n\nUse instead:\n```python\nclass Foo:\n    def __hash__(self):\n        return 2\n```\n\n## References\n- [Python documentation: The `__hash__` method](https://docs.python.org/3/reference/datamodel.html#object.__hash__)\n"
  },
  {
    "name": "invalid-all-object",
    "code": "PLE0604",
    "explanation": "## What it does\nChecks for the inclusion of invalid objects in `__all__`.\n\n## Why is this bad?\nIn Python, `__all__` should contain a sequence of strings that represent\nthe names of all \"public\" symbols exported by a module.\n\nAssigning anything other than a `tuple` or `list` of strings to `__all__`\nis invalid.\n\n## Example\n```python\n__all__ = [Foo, 1, None]\n```\n\nUse instead:\n```python\n__all__ = [\"Foo\", \"Bar\", \"Baz\"]\n```\n\n## References\n- [Python documentation: The `import` statement](https://docs.python.org/3/reference/simple_stmts.html#the-import-statement)\n"
  },
  {
    "name": "invalid-all-format",
    "code": "PLE0605",
    "explanation": "## What it does\nChecks for invalid assignments to `__all__`.\n\n## Why is this bad?\nIn Python, `__all__` should contain a sequence of strings that represent\nthe names of all \"public\" symbols exported by a module.\n\nAssigning anything other than a `tuple` or `list` of strings to `__all__`\nis invalid.\n\n## Example\n```python\n__all__ = \"Foo\"\n```\n\nUse instead:\n```python\n__all__ = (\"Foo\",)\n```\n\n## References\n- [Python documentation: The `import` statement](https://docs.python.org/3/reference/simple_stmts.html#the-import-statement)\n"
  },
  {
    "name": "potential-index-error",
    "code": "PLE0643",
    "explanation": "## What it does\nChecks for hard-coded sequence accesses that are known to be out of bounds.\n\n## Why is this bad?\nAttempting to access a sequence with an out-of-bounds index will cause an\n`IndexError` to be raised at runtime. When the sequence and index are\ndefined statically (e.g., subscripts on `list` and `tuple` literals, with\ninteger indexes), such errors can be detected ahead of time.\n\n## Example\n```python\nprint([0, 1, 2][3])\n```\n"
  },
  {
    "name": "misplaced-bare-raise",
    "code": "PLE0704",
    "explanation": "## What it does\nChecks for bare `raise` statements outside of exception handlers.\n\n## Why is this bad?\nA bare `raise` statement without an exception object will re-raise the last\nexception that was active in the current scope, and is typically used\nwithin an exception handler to re-raise the caught exception.\n\nIf a bare `raise` is used outside of an exception handler, it will generate\nan error due to the lack of an active exception.\n\nNote that a bare `raise` within a  `finally` block will work in some cases\n(namely, when the exception is raised within the `try` block), but should\nbe avoided as it can lead to confusing behavior.\n\n## Example\n```python\nfrom typing import Any\n\n\ndef is_some(obj: Any) -> bool:\n    if obj is None:\n        raise\n```\n\nUse instead:\n```python\nfrom typing import Any\n\n\ndef is_some(obj: Any) -> bool:\n    if obj is None:\n        raise ValueError(\"`obj` cannot be `None`\")\n```\n"
  },
  {
    "name": "repeated-keyword-argument",
    "code": "PLE1132",
    "explanation": "## What it does\nChecks for repeated keyword arguments in function calls.\n\n## Why is this bad?\nPython does not allow repeated keyword arguments in function calls. If a\nfunction is called with the same keyword argument multiple times, the\ninterpreter will raise an exception.\n\n## Example\n```python\nfunc(1, 2, c=3, **{\"c\": 4})\n```\n\n## References\n- [Python documentation: Argument](https://docs.python.org/3/glossary.html#term-argument)\n"
  },
  {
    "name": "dict-iter-missing-items",
    "code": "PLE1141",
    "explanation": "## What it does\nChecks for dictionary unpacking in a for loop without calling `.items()`.\n\n## Why is this bad?\nWhen iterating over a dictionary in a for loop, if a dictionary is unpacked\nwithout calling `.items()`, it could lead to a runtime error if the keys are not\na tuple of two elements.\n\nIt is likely that you're looking for an iteration over (key, value) pairs which\ncan only be achieved when calling `.items()`.\n\n## Example\n```python\ndata = {\"Paris\": 2_165_423, \"New York City\": 8_804_190, \"Tokyo\": 13_988_129}\n\nfor city, population in data:\n    print(f\"{city} has population {population}.\")\n```\n\nUse instead:\n```python\ndata = {\"Paris\": 2_165_423, \"New York City\": 8_804_190, \"Tokyo\": 13_988_129}\n\nfor city, population in data.items():\n    print(f\"{city} has population {population}.\")\n```\n\n## Known problems\nIf the dictionary key is a tuple, e.g.:\n\n```python\nd = {(1, 2): 3, (3, 4): 5}\nfor x, y in d:\n    print(x, y)\n```\n\nThe tuple key is unpacked into `x` and `y` instead of the key and values. This means that\nthe suggested fix of using `d.items()` would result in different runtime behavior. Ruff\ncannot consistently infer the type of a dictionary's keys.\n\n## Fix safety\nDue to the known problem with tuple keys, this fix is unsafe.\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "await-outside-async",
    "code": "PLE1142",
    "explanation": "## What it does\nChecks for uses of `await` outside `async` functions.\n\n## Why is this bad?\nUsing `await` outside an `async` function is a syntax error.\n\n## Example\n```python\nimport asyncio\n\n\ndef foo():\n    await asyncio.sleep(1)\n```\n\nUse instead:\n```python\nimport asyncio\n\n\nasync def foo():\n    await asyncio.sleep(1)\n```\n\n## Notebook behavior\nAs an exception, `await` is allowed at the top level of a Jupyter notebook\n(see: [autoawait]).\n\n## References\n- [Python documentation: Await expression](https://docs.python.org/3/reference/expressions.html#await)\n- [PEP 492: Await Expression](https://peps.python.org/pep-0492/#await-expression)\n\n[autoawait]: https://ipython.readthedocs.io/en/stable/interactive/autoawait.html\n"
  },
  {
    "name": "logging-too-many-args",
    "code": "PLE1205",
    "explanation": "## What it does\nChecks for too many positional arguments for a `logging` format string.\n\n## Why is this bad?\nA `TypeError` will be raised if the statement is run.\n\n## Example\n```python\nimport logging\n\ntry:\n    function()\nexcept Exception as e:\n    logging.error(\"Error occurred: %s\", type(e), e)\n    raise\n```\n\nUse instead:\n```python\nimport logging\n\ntry:\n    function()\nexcept Exception as e:\n    logging.error(\"%s error occurred: %s\", type(e), e)\n    raise\n```\n"
  },
  {
    "name": "logging-too-few-args",
    "code": "PLE1206",
    "explanation": "## What it does\nChecks for too few positional arguments for a `logging` format string.\n\n## Why is this bad?\nA `TypeError` will be raised if the statement is run.\n\n## Example\n```python\nimport logging\n\ntry:\n    function()\nexcept Exception as e:\n    logging.error(\"%s error occurred: %s\", e)\n    raise\n```\n\nUse instead:\n```python\nimport logging\n\ntry:\n    function()\nexcept Exception as e:\n    logging.error(\"%s error occurred: %s\", type(e), e)\n    raise\n```\n"
  },
  {
    "name": "bad-string-format-character",
    "code": "PLE1300",
    "explanation": "## What it does\nChecks for unsupported format types in format strings.\n\n## Why is this bad?\nAn invalid format string character will result in an error at runtime.\n\n## Example\n```python\n# `z` is not a valid format type.\nprint(\"%z\" % \"1\")\n\nprint(\"{:z}\".format(\"1\"))\n```\n"
  },
  {
    "name": "bad-string-format-type",
    "code": "PLE1307",
    "explanation": "## What it does\nChecks for mismatched argument types in \"old-style\" format strings.\n\n## Why is this bad?\nThe format string is not checked at compile time, so it is easy to\nintroduce bugs by mistyping the format string.\n\n## Example\n```python\nprint(\"%d\" % \"1\")\n```\n\nUse instead:\n```python\nprint(\"%d\" % 1)\n```\n"
  },
  {
    "name": "bad-str-strip-call",
    "code": "PLE1310",
    "explanation": "## What it does\nChecks duplicate characters in `str.strip` calls.\n\n## Why is this bad?\nAll characters in `str.strip` calls are removed from both the leading and\ntrailing ends of the string. Including duplicate characters in the call\nis redundant and often indicative of a mistake.\n\nIn Python 3.9 and later, you can use `str.removeprefix` and\n`str.removesuffix` to remove an exact prefix or suffix from a string,\nrespectively, which should be preferred when possible.\n\n## Example\n```python\n# Evaluates to \"foo\".\n\"bar foo baz\".strip(\"bar baz \")\n```\n\nUse instead:\n```python\n# Evaluates to \"foo\".\n\"bar foo baz\".strip(\"abrz \")  # \"foo\"\n```\n\nOr:\n```python\n# Evaluates to \"foo\".\n\"bar foo baz\".removeprefix(\"bar \").removesuffix(\" baz\")\n```\n\n## Options\n- `target-version`\n\n## References\n- [Python documentation: `str.strip`](https://docs.python.org/3/library/stdtypes.html?highlight=strip#str.strip)\n"
  },
  {
    "name": "invalid-envvar-value",
    "code": "PLE1507",
    "explanation": "## What it does\nChecks for `os.getenv` calls with an invalid `key` argument.\n\n## Why is this bad?\n`os.getenv` only supports strings as the first argument (`key`).\n\nIf the provided argument is not a string, `os.getenv` will throw a\n`TypeError` at runtime.\n\n## Example\n```python\nos.getenv(1)\n```\n\nUse instead:\n```python\nos.getenv(\"1\")\n```\n"
  },
  {
    "name": "singledispatch-method",
    "code": "PLE1519",
    "explanation": "## What it does\nChecks for methods decorated with `@singledispatch`.\n\n## Why is this bad?\nThe `@singledispatch` decorator is intended for use with functions, not methods.\n\nInstead, use the `@singledispatchmethod` decorator, or migrate the method to a\nstandalone function.\n\n## Example\n\n```python\nfrom functools import singledispatch\n\n\nclass Class:\n    @singledispatch\n    def method(self, arg): ...\n```\n\nUse instead:\n\n```python\nfrom functools import singledispatchmethod\n\n\nclass Class:\n    @singledispatchmethod\n    def method(self, arg): ...\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as migrating from `@singledispatch` to\n`@singledispatchmethod` may change the behavior of the code.\n",
    "fix": 1
  },
  {
    "name": "singledispatchmethod-function",
    "code": "PLE1520",
    "explanation": "## What it does\nChecks for non-method functions decorated with `@singledispatchmethod`.\n\n## Why is this bad?\nThe `@singledispatchmethod` decorator is intended for use with methods, not\nfunctions.\n\nInstead, use the `@singledispatch` decorator.\n\n## Example\n\n```python\nfrom functools import singledispatchmethod\n\n\n@singledispatchmethod\ndef func(arg): ...\n```\n\nUse instead:\n\n```python\nfrom functools import singledispatch\n\n\n@singledispatch\ndef func(arg): ...\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as migrating from `@singledispatchmethod` to\n`@singledispatch` may change the behavior of the code.\n",
    "fix": 1
  },
  {
    "name": "yield-from-in-async-function",
    "code": "PLE1700",
    "explanation": "## What it does\nChecks for uses of `yield from` in async functions.\n\n## Why is this bad?\nPython doesn't support the use of `yield from` in async functions, and will\nraise a `SyntaxError` in such cases.\n\nInstead, considering refactoring the code to use an `async for` loop instead.\n\n## Example\n```python\nasync def numbers():\n    yield from [1, 2, 3, 4, 5]\n```\n\nUse instead:\n```python\nasync def numbers():\n    async for number in [1, 2, 3, 4, 5]:\n        yield number\n```\n"
  },
  {
    "name": "bidirectional-unicode",
    "code": "PLE2502",
    "explanation": "## What it does\nChecks for bidirectional unicode characters.\n\n## Why is this bad?\nThe interaction between bidirectional unicode characters and the\nsurrounding code can be surprising to those that are unfamiliar\nwith right-to-left writing systems.\n\nIn some cases, bidirectional unicode characters can also be used to\nobfuscate code and introduce or mask security vulnerabilities.\n\n## Example\n```python\ns = \"\u05d0\" * 100  #  \"\u05d0\" is assigned\nprint(s)  # prints a 100-character string\n```\n\n## References\n- [PEP 672: Bidirectional Text](https://peps.python.org/pep-0672/#bidirectional-text)\n"
  },
  {
    "name": "invalid-character-backspace",
    "code": "PLE2510",
    "explanation": "## What it does\nChecks for strings that contain the control character `BS`.\n\n## Why is this bad?\nControl characters are displayed differently by different text editors and\nterminals.\n\nBy using the `\\b` sequence in lieu of the `BS` control character, the\nstring will contain the same value, but will render visibly in all editors.\n\n## Example\n```python\nx = \"\"\n```\n\nUse instead:\n```python\nx = \"\\b\"\n```\n",
    "fix": 1
  },
  {
    "name": "invalid-character-sub",
    "code": "PLE2512",
    "explanation": "## What it does\nChecks for strings that contain the raw control character `SUB`.\n\n## Why is this bad?\nControl characters are displayed differently by different text editors and\nterminals.\n\nBy using the `\\x1A` sequence in lieu of the `SUB` control character, the\nstring will contain the same value, but will render visibly in all editors.\n\n## Example\n```python\nx = \"\"\n```\n\nUse instead:\n```python\nx = \"\\x1a\"\n```\n",
    "fix": 1
  },
  {
    "name": "invalid-character-esc",
    "code": "PLE2513",
    "explanation": "## What it does\nChecks for strings that contain the raw control character `ESC`.\n\n## Why is this bad?\nControl characters are displayed differently by different text editors and\nterminals.\n\nBy using the `\\x1B` sequence in lieu of the `SUB` control character, the\nstring will contain the same value, but will render visibly in all editors.\n\n## Example\n```python\nx = \"\"\n```\n\nUse instead:\n```python\nx = \"\\x1b\"\n```\n",
    "fix": 1
  },
  {
    "name": "invalid-character-nul",
    "code": "PLE2514",
    "explanation": "## What it does\nChecks for strings that contain the raw control character `NUL` (0 byte).\n\n## Why is this bad?\nControl characters are displayed differently by different text editors and\nterminals.\n\nBy using the `\\0` sequence in lieu of the `NUL` control character, the\nstring will contain the same value, but will render visibly in all editors.\n\n## Example\n```python\nx = \"\"\n```\n\nUse instead:\n```python\nx = \"\\0\"\n```\n",
    "fix": 1
  },
  {
    "name": "invalid-character-zero-width-space",
    "code": "PLE2515",
    "explanation": "## What it does\nChecks for strings that contain the zero width space character.\n\n## Why is this bad?\nThis character is rendered invisibly in some text editors and terminals.\n\nBy using the `\\u200B` sequence, the string will contain the same value,\nbut will render visibly in all editors.\n\n## Example\n```python\nx = \"Dear Sir/Madam\"\n```\n\nUse instead:\n```python\nx = \"Dear Sir\\u200b/\\u200bMadam\"  # zero width space\n```\n",
    "fix": 1
  },
  {
    "name": "modified-iterating-set",
    "code": "PLE4703",
    "explanation": "## What it does\nChecks for loops in which a `set` is modified during iteration.\n\n## Why is this bad?\nIf a `set` is modified during iteration, it will cause a `RuntimeError`.\n\nIf you need to modify a `set` within a loop, consider iterating over a copy\nof the `set` instead.\n\n## Known problems\nThis rule favors false negatives over false positives. Specifically, it\nwill only detect variables that can be inferred to be a `set` type based on\nlocal type inference, and will only detect modifications that are made\ndirectly on the variable itself (e.g., `set.add()`), as opposed to\nmodifications within other function calls (e.g., `some_function(set)`).\n\n## Example\n```python\nnums = {1, 2, 3}\nfor num in nums:\n    nums.add(num + 5)\n```\n\nUse instead:\n```python\nnums = {1, 2, 3}\nfor num in nums.copy():\n    nums.add(num + 5)\n```\n\n## References\n- [Python documentation: `set`](https://docs.python.org/3/library/stdtypes.html#set)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "comparison-with-itself",
    "code": "PLR0124",
    "explanation": "## What it does\nChecks for operations that compare a name to itself.\n\n## Why is this bad?\nComparing a name to itself always results in the same value, and is likely\na mistake.\n\n## Example\n```python\nfoo == foo\n```\n\nIn some cases, self-comparisons are used to determine whether a float is\nNaN. Instead, prefer `math.isnan`:\n```python\nimport math\n\nmath.isnan(foo)\n```\n\n## References\n- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)\n"
  },
  {
    "name": "comparison-of-constant",
    "code": "PLR0133",
    "explanation": "## What it does\nChecks for comparisons between constants.\n\n## Why is this bad?\nComparing two constants will always resolve to the same value, so the\ncomparison is redundant. Instead, the expression should be replaced\nwith the result of the comparison.\n\n## Example\n```python\nfoo = 1 == 1\n```\n\nUse instead:\n```python\nfoo = True\n```\n\n## References\n- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)\n"
  },
  {
    "name": "no-classmethod-decorator",
    "code": "PLR0202",
    "explanation": "## What it does\nChecks for the use of a classmethod being made without the decorator.\n\n## Why is this bad?\nWhen it comes to consistency and readability, it's preferred to use the decorator.\n\n## Example\n\n```python\nclass Foo:\n    def bar(cls): ...\n\n    bar = classmethod(bar)\n```\n\nUse instead:\n\n```python\nclass Foo:\n    @classmethod\n    def bar(cls): ...\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "no-staticmethod-decorator",
    "code": "PLR0203",
    "explanation": "## What it does\nChecks for the use of a staticmethod being made without the decorator.\n\n## Why is this bad?\nWhen it comes to consistency and readability, it's preferred to use the decorator.\n\n## Example\n\n```python\nclass Foo:\n    def bar(arg1, arg2): ...\n\n    bar = staticmethod(bar)\n```\n\nUse instead:\n\n```python\nclass Foo:\n    @staticmethod\n    def bar(arg1, arg2): ...\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "property-with-parameters",
    "code": "PLR0206",
    "explanation": "## What it does\nChecks for property definitions that accept function parameters.\n\n## Why is this bad?\nProperties cannot be called with parameters.\n\nIf you need to pass parameters to a property, create a method with the\ndesired parameters and call that method instead.\n\n## Example\n\n```python\nclass Cat:\n    @property\n    def purr(self, volume): ...\n```\n\nUse instead:\n\n```python\nclass Cat:\n    @property\n    def purr(self): ...\n\n    def purr_volume(self, volume): ...\n```\n\n## References\n- [Python documentation: `property`](https://docs.python.org/3/library/functions.html#property)\n"
  },
  {
    "name": "manual-from-import",
    "code": "PLR0402",
    "explanation": "## What it does\nChecks for submodule imports that are aliased to the submodule name.\n\n## Why is this bad?\nUsing the `from` keyword to import the submodule is more concise and\nreadable.\n\n## Example\n```python\nimport concurrent.futures as futures\n```\n\nUse instead:\n```python\nfrom concurrent import futures\n```\n\n## References\n- [Python documentation: Submodules](https://docs.python.org/3/reference/import.html#submodules)\n",
    "fix": 1
  },
  {
    "name": "too-many-public-methods",
    "code": "PLR0904",
    "explanation": "## What it does\nChecks for classes with too many public methods\n\nBy default, this rule allows up to 20 public methods, as configured by\nthe [`lint.pylint.max-public-methods`] option.\n\n## Why is this bad?\nClasses with many public methods are harder to understand\nand maintain.\n\nInstead, consider refactoring the class into separate classes.\n\n## Example\nAssuming that `lint.pylint.max-public-methods` is set to 5:\n```python\nclass Linter:\n    def __init__(self):\n        pass\n\n    def pylint(self):\n        pass\n\n    def pylint_settings(self):\n        pass\n\n    def flake8(self):\n        pass\n\n    def flake8_settings(self):\n        pass\n\n    def pydocstyle(self):\n        pass\n\n    def pydocstyle_settings(self):\n        pass\n```\n\nUse instead:\n```python\nclass Linter:\n    def __init__(self):\n        self.pylint = Pylint()\n        self.flake8 = Flake8()\n        self.pydocstyle = Pydocstyle()\n\n    def lint(self):\n        pass\n\n\nclass Pylint:\n    def lint(self):\n        pass\n\n    def settings(self):\n        pass\n\n\nclass Flake8:\n    def lint(self):\n        pass\n\n    def settings(self):\n        pass\n\n\nclass Pydocstyle:\n    def lint(self):\n        pass\n\n    def settings(self):\n        pass\n```\n\n## Options\n- `lint.pylint.max-public-methods`\n",
    "preview": true
  },
  {
    "name": "too-many-return-statements",
    "code": "PLR0911",
    "explanation": "## What it does\nChecks for functions or methods with too many return statements.\n\nBy default, this rule allows up to six return statements, as configured by\nthe [`lint.pylint.max-returns`] option.\n\n## Why is this bad?\nFunctions or methods with many return statements are harder to understand\nand maintain, and often indicative of complex logic.\n\n## Example\n```python\ndef capital(country: str) -> str | None:\n    if country == \"England\":\n        return \"London\"\n    elif country == \"France\":\n        return \"Paris\"\n    elif country == \"Poland\":\n        return \"Warsaw\"\n    elif country == \"Romania\":\n        return \"Bucharest\"\n    elif country == \"Spain\":\n        return \"Madrid\"\n    elif country == \"Thailand\":\n        return \"Bangkok\"\n    else:\n        return None\n```\n\nUse instead:\n```python\ndef capital(country: str) -> str | None:\n    capitals = {\n        \"England\": \"London\",\n        \"France\": \"Paris\",\n        \"Poland\": \"Warsaw\",\n        \"Romania\": \"Bucharest\",\n        \"Spain\": \"Madrid\",\n        \"Thailand\": \"Bangkok\",\n    }\n    return capitals.get(country)\n```\n\n## Options\n- `lint.pylint.max-returns`\n"
  },
  {
    "name": "too-many-branches",
    "code": "PLR0912",
    "explanation": "## What it does\nChecks for functions or methods with too many branches, including (nested)\n`if`, `elif`, and `else` branches, `for` loops, `try`-`except` clauses, and\n`match` and `case` statements.\n\nBy default, this rule allows up to 12 branches. This can be configured\nusing the [`lint.pylint.max-branches`] option.\n\n## Why is this bad?\nFunctions or methods with many branches are harder to understand\nand maintain than functions or methods with fewer branches.\n\n## Example\nGiven:\n```python\ndef capital(country):\n    if country == \"Australia\":\n        return \"Canberra\"\n    elif country == \"Brazil\":\n        return \"Brasilia\"\n    elif country == \"Canada\":\n        return \"Ottawa\"\n    elif country == \"England\":\n        return \"London\"\n    elif country == \"France\":\n        return \"Paris\"\n    elif country == \"Germany\":\n        return \"Berlin\"\n    elif country == \"Poland\":\n        return \"Warsaw\"\n    elif country == \"Romania\":\n        return \"Bucharest\"\n    elif country == \"Spain\":\n        return \"Madrid\"\n    elif country == \"Thailand\":\n        return \"Bangkok\"\n    elif country == \"Turkey\":\n        return \"Ankara\"\n    elif country == \"United States\":\n        return \"Washington\"\n    else:\n        return \"Unknown\"  # 13th branch\n```\n\nUse instead:\n```python\ndef capital(country):\n    capitals = {\n        \"Australia\": \"Canberra\",\n        \"Brazil\": \"Brasilia\",\n        \"Canada\": \"Ottawa\",\n        \"England\": \"London\",\n        \"France\": \"Paris\",\n        \"Germany\": \"Berlin\",\n        \"Poland\": \"Warsaw\",\n        \"Romania\": \"Bucharest\",\n        \"Spain\": \"Madrid\",\n        \"Thailand\": \"Bangkok\",\n        \"Turkey\": \"Ankara\",\n        \"United States\": \"Washington\",\n    }\n    city = capitals.get(country, \"Unknown\")\n    return city\n```\n\nGiven:\n```python\ndef grades_to_average_number(grades):\n    numbers = []\n    for grade in grades:  # 1st branch\n        if len(grade) not in {1, 2}:\n            raise ValueError(f\"Invalid grade: {grade}\")\n\n        if len(grade) == 2 and grade[1] not in {\"+\", \"-\"}:\n            raise ValueError(f\"Invalid grade: {grade}\")\n\n        letter = grade[0]\n\n        if letter in {\"F\", \"E\"}:\n            number = 0.0\n        elif letter == \"D\":\n            number = 1.0\n        elif letter == \"C\":\n            number = 2.0\n        elif letter == \"B\":\n            number = 3.0\n        elif letter == \"A\":\n            number = 4.0\n        else:\n            raise ValueError(f\"Invalid grade: {grade}\")\n\n        modifier = 0.0\n        if letter != \"F\" and grade[-1] == \"+\":\n            modifier = 0.3\n        elif letter != \"F\" and grade[-1] == \"-\":\n            modifier = -0.3\n\n        numbers.append(max(0.0, min(number + modifier, 4.0)))\n\n    try:\n        return sum(numbers) / len(numbers)\n    except ZeroDivisionError:  # 13th branch\n        return 0\n```\n\nUse instead:\n```python\ndef grades_to_average_number(grades):\n    grade_values = {\"F\": 0.0, \"E\": 0.0, \"D\": 1.0, \"C\": 2.0, \"B\": 3.0, \"A\": 4.0}\n    modifier_values = {\"+\": 0.3, \"-\": -0.3}\n\n    numbers = []\n    for grade in grades:\n        if len(grade) not in {1, 2}:\n            raise ValueError(f\"Invalid grade: {grade}\")\n\n        letter = grade[0]\n        if letter not in grade_values:\n            raise ValueError(f\"Invalid grade: {grade}\")\n        number = grade_values[letter]\n\n        if len(grade) == 2 and grade[1] not in modifier_values:\n            raise ValueError(f\"Invalid grade: {grade}\")\n        modifier = modifier_values.get(grade[-1], 0.0)\n\n        if letter == \"F\":\n            numbers.append(0.0)\n        else:\n            numbers.append(max(0.0, min(number + modifier, 4.0)))\n\n    try:\n        return sum(numbers) / len(numbers)\n    except ZeroDivisionError:\n        return 0\n```\n\n## Options\n- `lint.pylint.max-branches`\n"
  },
  {
    "name": "too-many-arguments",
    "code": "PLR0913",
    "explanation": "## What it does\nChecks for function definitions that include too many arguments.\n\nBy default, this rule allows up to five arguments, as configured by the\n[`lint.pylint.max-args`] option.\n\n## Why is this bad?\nFunctions with many arguments are harder to understand, maintain, and call.\nConsider refactoring functions with many arguments into smaller functions\nwith fewer arguments, or using objects to group related arguments.\n\n## Example\n```python\ndef calculate_position(x_pos, y_pos, z_pos, x_vel, y_vel, z_vel, time):\n    new_x = x_pos + x_vel * time\n    new_y = y_pos + y_vel * time\n    new_z = z_pos + z_vel * time\n    return new_x, new_y, new_z\n```\n\nUse instead:\n```python\nfrom typing import NamedTuple\n\n\nclass Vector(NamedTuple):\n    x: float\n    y: float\n    z: float\n\n\ndef calculate_position(pos: Vector, vel: Vector, time: float) -> Vector:\n    return Vector(*(p + v * time for p, v in zip(pos, vel)))\n```\n\n## Options\n- `lint.pylint.max-args`\n"
  },
  {
    "name": "too-many-locals",
    "code": "PLR0914",
    "explanation": "## What it does\nChecks for functions that include too many local variables.\n\nBy default, this rule allows up to fifteen locals, as configured by the\n[`lint.pylint.max-locals`] option.\n\n## Why is this bad?\nFunctions with many local variables are harder to understand and maintain.\n\nConsider refactoring functions with many local variables into smaller\nfunctions with fewer assignments.\n\n## Options\n- `lint.pylint.max-locals`\n",
    "preview": true
  },
  {
    "name": "too-many-statements",
    "code": "PLR0915",
    "explanation": "## What it does\nChecks for functions or methods with too many statements.\n\nBy default, this rule allows up to 50 statements, as configured by the\n[`lint.pylint.max-statements`] option.\n\n## Why is this bad?\nFunctions or methods with many statements are harder to understand\nand maintain.\n\nInstead, consider refactoring the function or method into smaller\nfunctions or methods, or identifying generalizable patterns and\nreplacing them with generic logic or abstractions.\n\n## Example\n```python\ndef is_even(number: int) -> bool:\n    if number == 0:\n        return True\n    elif number == 1:\n        return False\n    elif number == 2:\n        return True\n    elif number == 3:\n        return False\n    elif number == 4:\n        return True\n    elif number == 5:\n        return False\n    else:\n        ...\n```\n\nUse instead:\n```python\ndef is_even(number: int) -> bool:\n    return number % 2 == 0\n```\n\n## Options\n- `lint.pylint.max-statements`\n"
  },
  {
    "name": "too-many-boolean-expressions",
    "code": "PLR0916",
    "explanation": "## What it does\nChecks for too many Boolean expressions in an `if` statement.\n\nBy default, this rule allows up to 5 expressions. This can be configured\nusing the [`lint.pylint.max-bool-expr`] option.\n\n## Why is this bad?\n`if` statements with many Boolean expressions are harder to understand\nand maintain. Consider assigning the result of the Boolean expression,\nor any of its sub-expressions, to a variable.\n\n## Example\n```python\nif a and b and c and d and e and f and g and h:\n    ...\n```\n\n## Options\n- `lint.pylint.max-bool-expr`\n",
    "preview": true
  },
  {
    "name": "too-many-positional-arguments",
    "code": "PLR0917",
    "explanation": "## What it does\nChecks for function definitions that include too many positional arguments.\n\nBy default, this rule allows up to five arguments, as configured by the\n[`lint.pylint.max-positional-args`] option.\n\n## Why is this bad?\nFunctions with many arguments are harder to understand, maintain, and call.\nThis is especially true for functions with many positional arguments, as\nproviding arguments positionally is more error-prone and less clear to\nreaders than providing arguments by name.\n\nConsider refactoring functions with many arguments into smaller functions\nwith fewer arguments, using objects to group related arguments, or migrating to\n[keyword-only arguments](https://docs.python.org/3/tutorial/controlflow.html#special-parameters).\n\n## Example\n\n```python\ndef plot(x, y, z, color, mark, add_trendline): ...\n\n\nplot(1, 2, 3, \"r\", \"*\", True)\n```\n\nUse instead:\n\n```python\ndef plot(x, y, z, *, color, mark, add_trendline): ...\n\n\nplot(1, 2, 3, color=\"r\", mark=\"*\", add_trendline=True)\n```\n\n## Options\n- `lint.pylint.max-positional-args`\n",
    "preview": true
  },
  {
    "name": "repeated-isinstance-calls",
    "code": "PLR1701",
    "explanation": "## Removed\nThis rule is identical to [SIM101] which should be used instead.\n\n## What it does\nChecks for repeated `isinstance` calls on the same object.\n\n## Why is this bad?\nRepeated `isinstance` calls on the same object can be merged into a\nsingle call.\n\n## Fix safety\nThis rule's fix is marked as unsafe on Python 3.10 and later, as combining\nmultiple `isinstance` calls with a binary operator (`|`) will fail at\nruntime if any of the operands are themselves tuples.\n\nFor example, given `TYPES = (dict, list)`, then\n`isinstance(None, TYPES | set | float)` will raise a `TypeError` at runtime,\nwhile `isinstance(None, set | float)` will not.\n\n## Example\n```python\ndef is_number(x):\n    return isinstance(x, int) or isinstance(x, float) or isinstance(x, complex)\n```\n\nUse instead:\n```python\ndef is_number(x):\n    return isinstance(x, (int, float, complex))\n```\n\nOr, for Python 3.10 and later:\n\n```python\ndef is_number(x):\n    return isinstance(x, int | float | complex)\n```\n\n## Options\n- `target-version`\n\n## References\n- [Python documentation: `isinstance`](https://docs.python.org/3/library/functions.html#isinstance)\n\n[SIM101]: https://docs.astral.sh/ruff/rules/duplicate-isinstance-call/\n",
    "fix": 2
  },
  {
    "name": "too-many-nested-blocks",
    "code": "PLR1702",
    "explanation": "## What it does\nChecks for functions or methods with too many nested blocks.\n\nBy default, this rule allows up to five nested blocks.\nThis can be configured using the [`lint.pylint.max-nested-blocks`] option.\n\n## Why is this bad?\nFunctions or methods with too many nested blocks are harder to understand\nand maintain.\n\n## Options\n- `lint.pylint.max-nested-blocks`\n",
    "preview": true
  },
  {
    "name": "redefined-argument-from-local",
    "code": "PLR1704",
    "explanation": "## What it does\nChecks for variables defined in `for`, `try`, `with` statements\nthat redefine function parameters.\n\n## Why is this bad?\nRedefined variables can cause unexpected behavior because of overridden function parameters.\nIf nested functions are declared, an inner function's body can override an outer function's parameters.\n\n## Example\n```python\ndef show(host_id=10.11):\n    for host_id, host in [[12.13, \"Venus\"], [14.15, \"Mars\"]]:\n        print(host_id, host)\n```\n\nUse instead:\n```python\ndef show(host_id=10.11):\n    for inner_host_id, host in [[12.13, \"Venus\"], [14.15, \"Mars\"]]:\n        print(host_id, inner_host_id, host)\n```\n\n## Options\n- `lint.dummy-variable-rgx`\n\n## References\n- [Pylint documentation](https://pylint.readthedocs.io/en/latest/user_guide/messages/refactor/redefined-argument-from-local.html)\n"
  },
  {
    "name": "and-or-ternary",
    "code": "PLR1706",
    "explanation": "## Removal\nThis rule was removed from Ruff because it was common for it to introduce behavioral changes.\nSee [#9007](https://github.com/astral-sh/ruff/issues/9007) for more information.\n\n## What it does\nChecks for uses of the known pre-Python 2.5 ternary syntax.\n\n## Why is this bad?\nPrior to the introduction of the if-expression (ternary) operator in Python\n2.5, the only way to express a conditional expression was to use the `and`\nand `or` operators.\n\nThe if-expression construct is clearer and more explicit, and should be\npreferred over the use of `and` and `or` for ternary expressions.\n\n## Example\n```python\nx, y = 1, 2\nmaximum = x >= y and x or y\n```\n\nUse instead:\n```python\nx, y = 1, 2\nmaximum = x if x >= y else y\n```\n"
  },
  {
    "name": "useless-return",
    "code": "PLR1711",
    "explanation": "## What it does\nChecks for functions that end with an unnecessary `return` or\n`return None`, and contain no other `return` statements.\n\n## Why is this bad?\nPython implicitly assumes a `None` return at the end of a function, making\nit unnecessary to explicitly write `return None`.\n\n## Example\n```python\ndef f():\n    print(5)\n    return None\n```\n\nUse instead:\n```python\ndef f():\n    print(5)\n```\n",
    "fix": 2
  },
  {
    "name": "repeated-equality-comparison",
    "code": "PLR1714",
    "explanation": "## What it does\nChecks for repeated equality comparisons that can be rewritten as a membership\ntest.\n\nThis rule will try to determine if the values are hashable\nand the fix will use a `set` if they are. If unable to determine, the fix\nwill use a `tuple` and suggest the use of a `set`.\n\n## Why is this bad?\nTo check if a variable is equal to one of many values, it is common to\nwrite a series of equality comparisons (e.g.,\n`foo == \"bar\" or foo == \"baz\"`).\n\nInstead, prefer to combine the values into a collection and use the `in`\noperator to check for membership, which is more performant and succinct.\nIf the items are hashable, use a `set` for efficiency; otherwise, use a\n`tuple`.\n\n## Example\n```python\nfoo == \"bar\" or foo == \"baz\" or foo == \"qux\"\n```\n\nUse instead:\n```python\nfoo in {\"bar\", \"baz\", \"qux\"}\n```\n\n## References\n- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)\n- [Python documentation: Membership test operations](https://docs.python.org/3/reference/expressions.html#membership-test-operations)\n- [Python documentation: `set`](https://docs.python.org/3/library/stdtypes.html#set)\n",
    "fix": 2
  },
  {
    "name": "boolean-chained-comparison",
    "code": "PLR1716",
    "explanation": "## What it does\nCheck for chained boolean operations that can be simplified.\n\n## Why is this bad?\nRefactoring the code will improve readability for these cases.\n\n## Example\n\n```python\na = int(input())\nb = int(input())\nc = int(input())\nif a < b and b < c:\n    pass\n```\n\nUse instead:\n\n```python\na = int(input())\nb = int(input())\nc = int(input())\nif a < b < c:\n    pass\n```\n",
    "fix": 2
  },
  {
    "name": "sys-exit-alias",
    "code": "PLR1722",
    "explanation": "## What it does\nChecks for uses of the `exit()` and `quit()`.\n\n## Why is this bad?\n`exit` and `quit` come from the `site` module, which is typically imported\nautomatically during startup. However, it is not _guaranteed_ to be\nimported, and so using these functions may result in a `NameError` at\nruntime. Generally, these constants are intended to be used in an interactive\ninterpreter, and not in programs.\n\nPrefer `sys.exit()`, as the `sys` module is guaranteed to exist in all\ncontexts.\n\n## Example\n```python\nif __name__ == \"__main__\":\n    exit()\n```\n\nUse instead:\n```python\nimport sys\n\nif __name__ == \"__main__\":\n    sys.exit()\n```\n\n## References\n- [Python documentation: Constants added by the `site` module](https://docs.python.org/3/library/constants.html#constants-added-by-the-site-module)\n",
    "fix": 1
  },
  {
    "name": "if-stmt-min-max",
    "code": "PLR1730",
    "explanation": "## What it does\nChecks for `if` statements that can be replaced with `min()` or `max()`\ncalls.\n\n## Why is this bad?\nAn `if` statement that selects the lesser or greater of two sub-expressions\ncan be replaced with a `min()` or `max()` call respectively. Where possible,\nprefer `min()` and `max()`, as they're more concise and readable than the\nequivalent `if` statements.\n\n## Example\n```python\nif score > highest_score:\n    highest_score = score\n```\n\nUse instead:\n```python\nhighest_score = max(highest_score, score)\n```\n\n## References\n- [Python documentation: `max`](https://docs.python.org/3/library/functions.html#max)\n- [Python documentation: `min`](https://docs.python.org/3/library/functions.html#min)\n",
    "fix": 1
  },
  {
    "name": "unnecessary-dict-index-lookup",
    "code": "PLR1733",
    "explanation": "## What it does\nChecks for key-based dict accesses during `.items()` iterations.\n\n## Why is this bad?\nWhen iterating over a dict via `.items()`, the current value is already\navailable alongside its key. Using the key to look up the value is\nunnecessary.\n\n## Example\n```python\nFRUITS = {\"apple\": 1, \"orange\": 10, \"berry\": 22}\n\nfor fruit_name, fruit_count in FRUITS.items():\n    print(FRUITS[fruit_name])\n```\n\nUse instead:\n```python\nFRUITS = {\"apple\": 1, \"orange\": 10, \"berry\": 22}\n\nfor fruit_name, fruit_count in FRUITS.items():\n    print(fruit_count)\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "unnecessary-list-index-lookup",
    "code": "PLR1736",
    "explanation": "## What it does\nChecks for index-based list accesses during `enumerate` iterations.\n\n## Why is this bad?\nWhen iterating over a list with `enumerate`, the current item is already\navailable alongside its index. Using the index to look up the item is\nunnecessary.\n\n## Example\n```python\nletters = [\"a\", \"b\", \"c\"]\n\nfor index, letter in enumerate(letters):\n    print(letters[index])\n```\n\nUse instead:\n```python\nletters = [\"a\", \"b\", \"c\"]\n\nfor index, letter in enumerate(letters):\n    print(letter)\n```\n",
    "fix": 2
  },
  {
    "name": "magic-value-comparison",
    "code": "PLR2004",
    "explanation": "## What it does\nChecks for the use of unnamed numerical constants (\"magic\") values in\ncomparisons.\n\n## Why is this bad?\nThe use of \"magic\" values can make code harder to read and maintain, as\nreaders will have to infer the meaning of the value from the context.\nSuch values are discouraged by [PEP 8].\n\nFor convenience, this rule excludes a variety of common values from the\n\"magic\" value definition, such as `0`, `1`, `\"\"`, and `\"__main__\"`.\n\n## Example\n```python\ndef apply_discount(price: float) -> float:\n    if price <= 100:\n        return price / 2\n    else:\n        return price\n```\n\nUse instead:\n```python\nMAX_DISCOUNT = 100\n\n\ndef apply_discount(price: float) -> float:\n    if price <= MAX_DISCOUNT:\n        return price / 2\n    else:\n        return price\n```\n\n## Options\n- `lint.pylint.allow-magic-value-types`\n\n[PEP 8]: https://peps.python.org/pep-0008/#constants\n"
  },
  {
    "name": "empty-comment",
    "code": "PLR2044",
    "explanation": "## What it does\nChecks for a # symbol appearing on a line not followed by an actual comment.\n\n## Why is this bad?\nEmpty comments don't provide any clarity to the code, and just add clutter.\nEither add a comment or delete the empty comment.\n\n## Example\n```python\nclass Foo:  #\n    pass\n```\n\nUse instead:\n```python\nclass Foo:\n    pass\n```\n\n## References\n- [Pylint documentation](https://pylint.pycqa.org/en/latest/user_guide/messages/refactor/empty-comment.html)\n",
    "fix": 2
  },
  {
    "name": "collapsible-else-if",
    "code": "PLR5501",
    "explanation": "## What it does\nChecks for `else` blocks that consist of a single `if` statement.\n\n## Why is this bad?\nIf an `else` block contains a single `if` statement, it can be collapsed\ninto an `elif`, thus reducing the indentation level.\n\n## Example\n```python\ndef check_sign(value: int) -> None:\n    if value > 0:\n        print(\"Number is positive.\")\n    else:\n        if value < 0:\n            print(\"Number is negative.\")\n        else:\n            print(\"Number is zero.\")\n```\n\nUse instead:\n```python\ndef check_sign(value: int) -> None:\n    if value > 0:\n        print(\"Number is positive.\")\n    elif value < 0:\n        print(\"Number is negative.\")\n    else:\n        print(\"Number is zero.\")\n```\n\n## References\n- [Python documentation: `if` Statements](https://docs.python.org/3/tutorial/controlflow.html#if-statements)\n",
    "fix": 1
  },
  {
    "name": "non-augmented-assignment",
    "code": "PLR6104",
    "explanation": "## What it does\nChecks for assignments that can be replaced with augmented assignment\nstatements.\n\n## Why is this bad?\nIf the right-hand side of an assignment statement consists of a binary\noperation in which one operand is the same as the assignment target,\nit can be rewritten as an augmented assignment. For example, `x = x + 1`\ncan be rewritten as `x += 1`.\n\nWhen performing such an operation, an augmented assignment is more concise\nand idiomatic.\n\n## Known problems\nIn some cases, this rule will not detect assignments in which the target\nis on the right-hand side of a binary operation (e.g., `x = y + x`, as\nopposed to `x = x + y`), as such operations are not commutative for\ncertain data types, like strings.\n\nFor example, `x = \"prefix-\" + x` is not equivalent to `x += \"prefix-\"`,\nwhile `x = 1 + x` is equivalent to `x += 1`.\n\nIf the type of the left-hand side cannot be trivially inferred, the rule\nwill ignore the assignment.\n\n## Example\n```python\nx = x + 1\n```\n\nUse instead:\n```python\nx += 1\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as augmented assignments have\ndifferent semantics when the target is a mutable data type, like a list or\ndictionary.\n\nFor example, consider the following:\n\n```python\nfoo = [1]\nbar = foo\nfoo = foo + [2]\nassert (foo, bar) == ([1, 2], [1])\n```\n\nIf the assignment is replaced with an augmented assignment, the update\noperation will apply to both `foo` and `bar`, as they refer to the same\nobject:\n\n```python\nfoo = [1]\nbar = foo\nfoo += [2]\nassert (foo, bar) == ([1, 2], [1, 2])\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "literal-membership",
    "code": "PLR6201",
    "explanation": "## What it does\nChecks for membership tests on `list` and `tuple` literals.\n\n## Why is this bad?\nWhen testing for membership in a static sequence, prefer a `set` literal\nover a `list` or `tuple`, as Python optimizes `set` membership tests.\n\n## Example\n```python\n1 in [1, 2, 3]\n```\n\nUse instead:\n```python\n1 in {1, 2, 3}\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as the use of a `set` literal will\nerror at runtime if the sequence contains unhashable elements (like lists\nor dictionaries). While Ruff will attempt to infer the hashability of the\nelements, it may not always be able to do so.\n\n## References\n- [What\u2019s New In Python 3.2](https://docs.python.org/3/whatsnew/3.2.html#optimizations)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "no-self-use",
    "code": "PLR6301",
    "explanation": "## What it does\nChecks for the presence of unused `self` parameter in methods definitions.\n\n## Why is this bad?\nUnused `self` parameters are usually a sign of a method that could be\nreplaced by a function, class method, or static method.\n\n## Example\n```python\nclass Person:\n    def greeting(self):\n        print(\"Greetings friend!\")\n```\n\nUse instead:\n```python\ndef greeting():\n    print(\"Greetings friend!\")\n```\n\nor\n\n```python\nclass Person:\n    @staticmethod\n    def greeting():\n        print(\"Greetings friend!\")\n```\n",
    "preview": true
  },
  {
    "name": "unnecessary-lambda",
    "code": "PLW0108",
    "explanation": "## What it does\nChecks for `lambda` definitions that consist of a single function call\nwith the same arguments as the `lambda` itself.\n\n## Why is this bad?\nWhen a `lambda` is used to wrap a function call, and merely propagates\nthe `lambda` arguments to that function, it can typically be replaced with\nthe function itself, removing a level of indirection.\n\n## Example\n```python\ndf.apply(lambda x: str(x))\n```\n\nUse instead:\n```python\ndf.apply(str)\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe for two primary reasons.\n\nFirst, the lambda body itself could contain an effect.\n\nFor example, replacing `lambda x, y: (func()(x, y))` with `func()` would\nlead to a change in behavior, as `func()` would be evaluated eagerly when\ndefining the lambda, rather than when the lambda is called.\n\nHowever, even when the lambda body itself is pure, the lambda may\nchange the argument names, which can lead to a change in behavior when\ncallers pass arguments by name.\n\nFor example, replacing `foo = lambda x, y: func(x, y)` with `foo = func`,\nwhere `func` is defined as `def func(a, b): return a + b`, would be a\nbreaking change for callers that execute the lambda by passing arguments by\nname, as in: `foo(x=1, y=2)`. Since `func` does not define the arguments\n`x` and `y`, unlike the lambda, the call would raise a `TypeError`.\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "useless-else-on-loop",
    "code": "PLW0120",
    "explanation": "## What it does\nChecks for `else` clauses on loops without a `break` statement.\n\n## Why is this bad?\nWhen a loop includes an `else` statement, the code inside the `else` clause\nwill be executed if the loop terminates \"normally\" (i.e., without a\n`break`).\n\nIf a loop _always_ terminates \"normally\" (i.e., does _not_ contain a\n`break`), then the `else` clause is redundant, as the code inside the\n`else` clause will always be executed.\n\nIn such cases, the code inside the `else` clause can be moved outside the\nloop entirely, and the `else` clause can be removed.\n\n## Example\n```python\nfor item in items:\n    print(item)\nelse:\n    print(\"All items printed\")\n```\n\nUse instead:\n```python\nfor item in items:\n    print(item)\nprint(\"All items printed\")\n```\n\n## References\n- [Python documentation: `break` and `continue` Statements, and `else` Clauses on Loops](https://docs.python.org/3/tutorial/controlflow.html#break-and-continue-statements-and-else-clauses-on-loops)\n",
    "fix": 1
  },
  {
    "name": "self-assigning-variable",
    "code": "PLW0127",
    "explanation": "## What it does\nChecks for self-assignment of variables.\n\n## Why is this bad?\nSelf-assignment of variables is redundant and likely a mistake.\n\n## Example\n```python\ncountry = \"Poland\"\ncountry = country\n```\n\nUse instead:\n```python\ncountry = \"Poland\"\n```\n"
  },
  {
    "name": "redeclared-assigned-name",
    "code": "PLW0128",
    "explanation": "## What it does\nChecks for declared assignments to the same variable multiple times\nin the same assignment.\n\n## Why is this bad?\nAssigning a variable multiple times in the same assignment is redundant,\nas the final assignment to the variable is what the value will be.\n\n## Example\n```python\na, b, a = (1, 2, 3)\nprint(a)  # 3\n```\n\nUse instead:\n```python\n# this is assuming you want to assign 3 to `a`\n_, b, a = (1, 2, 3)\nprint(a)  # 3\n```\n\n"
  },
  {
    "name": "assert-on-string-literal",
    "code": "PLW0129",
    "explanation": "## What it does\nChecks for `assert` statements that use a string literal as the first\nargument.\n\n## Why is this bad?\nAn `assert` on a non-empty string literal will always pass, while an\n`assert` on an empty string literal will always fail.\n\n## Example\n```python\nassert \"always true\"\n```\n"
  },
  {
    "name": "named-expr-without-context",
    "code": "PLW0131",
    "explanation": "## What it does\nChecks for uses of named expressions (e.g., `a := 42`) that can be\nreplaced by regular assignment statements (e.g., `a = 42`).\n\n## Why is this bad?\nWhile a top-level named expression is syntactically and semantically valid,\nit's less clear than a regular assignment statement. Named expressions are\nintended to be used in comprehensions and generator expressions, where\nassignment statements are not allowed.\n\n## Example\n```python\n(a := 42)\n```\n\nUse instead:\n```python\na = 42\n```\n"
  },
  {
    "name": "useless-exception-statement",
    "code": "PLW0133",
    "explanation": "## What it does\nChecks for an exception that is not raised.\n\n## Why is this bad?\nIt's unnecessary to create an exception without raising it. For example,\n`ValueError(\"...\")` on its own will have no effect (unlike\n`raise ValueError(\"...\")`) and is likely a mistake.\n\n## Known problems\nThis rule only detects built-in exceptions, like `ValueError`, and does\nnot catch user-defined exceptions.\n\n## Example\n```python\nValueError(\"...\")\n```\n\nUse instead:\n```python\nraise ValueError(\"...\")\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as converting a useless exception\nstatement to a `raise` statement will change the program's behavior.\n",
    "fix": 1
  },
  {
    "name": "nan-comparison",
    "code": "PLW0177",
    "explanation": "## What it does\nChecks for comparisons against NaN values.\n\n## Why is this bad?\nComparing against a NaN value can lead to unexpected results. For example,\n`float(\"NaN\") == float(\"NaN\")` will return `False` and, in general,\n`x == float(\"NaN\")` will always return `False`, even if `x` is `NaN`.\n\nTo determine whether a value is `NaN`, use `math.isnan` or `np.isnan`\ninstead of comparing against `NaN` directly.\n\n## Example\n```python\nif x == float(\"NaN\"):\n    pass\n```\n\nUse instead:\n```python\nimport math\n\nif math.isnan(x):\n    pass\n```\n\n",
    "preview": true
  },
  {
    "name": "bad-staticmethod-argument",
    "code": "PLW0211",
    "explanation": "## What it does\nChecks for static methods that use `self` or `cls` as their first argument.\nThis rule also applies to `__new__` methods, which are implicitly static.\n\n## Why is this bad?\n[PEP 8] recommends the use of `self` and `cls` as the first arguments for\ninstance methods and class methods, respectively. Naming the first argument\nof a static method as `self` or `cls` can be misleading, as static methods\ndo not receive an instance or class reference as their first argument.\n\n## Example\n```python\nclass Wolf:\n    @staticmethod\n    def eat(self):\n        pass\n```\n\nUse instead:\n```python\nclass Wolf:\n    @staticmethod\n    def eat(sheep):\n        pass\n```\n\n[PEP 8]: https://peps.python.org/pep-0008/#function-and-method-arguments\n"
  },
  {
    "name": "redefined-slots-in-subclass",
    "code": "PLW0244",
    "explanation": "## What it does\nChecks for a re-defined slot in a subclass.\n\n## Why is this bad?\nIf a class defines a slot also defined in a base class, the\ninstance variable defined by the base class slot is inaccessible\n(except by retrieving its descriptor directly from the base class).\n\n## Example\n```python\nclass Base:\n    __slots__ = (\"a\", \"b\")\n\n\nclass Subclass(Base):\n    __slots__ = (\"a\", \"d\")  # slot \"a\" redefined\n```\n\nUse instead:\n```python\nclass Base:\n    __slots__ = (\"a\", \"b\")\n\n\nclass Subclass(Base):\n    __slots__ = \"d\"\n```\n",
    "preview": true
  },
  {
    "name": "super-without-brackets",
    "code": "PLW0245",
    "explanation": "## What it does\nDetects attempts to use `super` without parentheses.\n\n## Why is this bad?\nThe [`super()` callable](https://docs.python.org/3/library/functions.html#super)\ncan be used inside method definitions to create a proxy object that\ndelegates attribute access to a superclass of the current class. Attempting\nto access attributes on `super` itself, however, instead of the object\nreturned by a call to `super()`, will raise `AttributeError`.\n\n## Example\n```python\nclass Animal:\n    @staticmethod\n    def speak():\n        return \"This animal says something.\"\n\n\nclass Dog(Animal):\n    @staticmethod\n    def speak():\n        original_speak = super.speak()  # ERROR: `super.speak()`\n        return f\"{original_speak} But as a dog, it barks!\"\n```\n\nUse instead:\n```python\nclass Animal:\n    @staticmethod\n    def speak():\n        return \"This animal says something.\"\n\n\nclass Dog(Animal):\n    @staticmethod\n    def speak():\n        original_speak = super().speak()  # Correct: `super().speak()`\n        return f\"{original_speak} But as a dog, it barks!\"\n```\n",
    "fix": 2
  },
  {
    "name": "import-self",
    "code": "PLW0406",
    "explanation": "## What it does\nChecks for import statements that import the current module.\n\n## Why is this bad?\nImporting a module from itself is a circular dependency and results\nin an `ImportError` exception.\n\n## Example\n\n```python\n# file: this_file.py\nfrom this_file import foo\n\n\ndef foo(): ...\n```\n"
  },
  {
    "name": "global-variable-not-assigned",
    "code": "PLW0602",
    "explanation": "## What it does\nChecks for `global` variables that are not assigned a value in the current\nscope.\n\n## Why is this bad?\nThe `global` keyword allows an inner scope to modify a variable declared\nin the outer scope. If the variable is not modified within the inner scope,\nthere is no need to use `global`.\n\n## Example\n```python\nDEBUG = True\n\n\ndef foo():\n    global DEBUG\n    if DEBUG:\n        print(\"foo() called\")\n    ...\n```\n\nUse instead:\n```python\nDEBUG = True\n\n\ndef foo():\n    if DEBUG:\n        print(\"foo() called\")\n    ...\n```\n\n## References\n- [Python documentation: The `global` statement](https://docs.python.org/3/reference/simple_stmts.html#the-global-statement)\n"
  },
  {
    "name": "global-statement",
    "code": "PLW0603",
    "explanation": "## What it does\nChecks for the use of `global` statements to update identifiers.\n\n## Why is this bad?\nPylint discourages the use of `global` variables as global mutable\nstate is a common source of bugs and confusing behavior.\n\n## Example\n```python\nvar = 1\n\n\ndef foo():\n    global var  # [global-statement]\n    var = 10\n    print(var)\n\n\nfoo()\nprint(var)\n```\n\nUse instead:\n```python\nvar = 1\n\n\ndef foo():\n    print(var)\n    return 10\n\n\nvar = foo()\nprint(var)\n```\n"
  },
  {
    "name": "global-at-module-level",
    "code": "PLW0604",
    "explanation": "## What it does\nChecks for uses of the `global` keyword at the module level.\n\n## Why is this bad?\nThe `global` keyword is used within functions to indicate that a name\nrefers to a global variable, rather than a local variable.\n\nAt the module level, all names are global by default, so the `global`\nkeyword is redundant.\n"
  },
  {
    "name": "self-or-cls-assignment",
    "code": "PLW0642",
    "explanation": "## What it does\nChecks for assignment of `self` and `cls` in instance and class methods respectively.\n\nThis check also applies to `__new__` even though this is technically\na static method.\n\n## Why is this bad?\nThe identifiers `self` and `cls` are conventional in Python for the first parameter of instance\nmethods and class methods, respectively. Assigning new values to these variables can be\nconfusing for others reading your code; using a different variable name can lead to clearer\ncode.\n\n## Example\n\n```python\nclass Version:\n    def add(self, other):\n        self = self + other\n        return self\n\n    @classmethod\n    def superclass(cls):\n        cls = cls.__mro__[-1]\n        return cls\n```\n\nUse instead:\n```python\nclass Version:\n    def add(self, other):\n        new_version = self + other\n        return new_version\n\n    @classmethod\n    def superclass(cls):\n        supercls = cls.__mro__[-1]\n        return supercls\n```\n"
  },
  {
    "name": "binary-op-exception",
    "code": "PLW0711",
    "explanation": "## What it does\nChecks for `except` clauses that attempt to catch multiple\nexceptions with a binary operation (`and` or `or`).\n\n## Why is this bad?\nA binary operation will not catch multiple exceptions. Instead, the binary\noperation will be evaluated first, and the result of _that_ operation will\nbe caught (for an `or` operation, this is typically the first exception in\nthe list). This is almost never the desired behavior.\n\n## Example\n```python\ntry:\n    pass\nexcept A or B:\n    pass\n```\n\nUse instead:\n```python\ntry:\n    pass\nexcept (A, B):\n    pass\n```\n"
  },
  {
    "name": "bad-open-mode",
    "code": "PLW1501",
    "explanation": "## What it does\nCheck for an invalid `mode` argument in `open` calls.\n\n## Why is this bad?\nThe `open` function accepts a `mode` argument that specifies how the file\nshould be opened (e.g., read-only, write-only, append-only, etc.).\n\nPython supports a variety of open modes: `r`, `w`, `a`, and `x`, to control\nreading, writing, appending, and creating, respectively, along with\n`b` (binary mode), `+` (read and write), and `U` (universal newlines),\nthe latter of which is only valid alongside `r`. This rule detects both\ninvalid combinations of modes and invalid characters in the mode string\nitself.\n\n## Example\n```python\nwith open(\"file\", \"rwx\") as f:\n    return f.read()\n```\n\nUse instead:\n```python\nwith open(\"file\", \"r\") as f:\n    return f.read()\n```\n\n## References\n- [Python documentation: `open`](https://docs.python.org/3/library/functions.html#open)\n"
  },
  {
    "name": "shallow-copy-environ",
    "code": "PLW1507",
    "explanation": "## What it does\nCheck for shallow `os.environ` copies.\n\n## Why is this bad?\n`os.environ` is not a `dict` object, but rather, a proxy object. As such, mutating a shallow\ncopy of `os.environ` will also mutate the original object.\n\nSee [BPO 15373] for more information.\n\n## Example\n```python\nimport copy\nimport os\n\nenv = copy.copy(os.environ)\n```\n\nUse instead:\n```python\nimport os\n\nenv = os.environ.copy()\n```\n\n## Fix safety\n\nThis rule's fix is marked as unsafe because replacing a shallow copy with a deep copy can lead\nto unintended side effects. If the program modifies the shallow copy at some point, changing it\nto a deep copy may prevent those modifications from affecting the original data, potentially\naltering the program's behavior.\n\n## References\n- [Python documentation: `copy` \u2014 Shallow and deep copy operations](https://docs.python.org/3/library/copy.html)\n- [Python documentation: `os.environ`](https://docs.python.org/3/library/os.html#os.environ)\n\n[BPO 15373]: https://bugs.python.org/issue15373\n",
    "fix": 2
  },
  {
    "name": "invalid-envvar-default",
    "code": "PLW1508",
    "explanation": "## What it does\nChecks for `os.getenv` calls with invalid default values.\n\n## Why is this bad?\nIf an environment variable is set, `os.getenv` will return its value as\na string. If the environment variable is _not_ set, `os.getenv` will\nreturn `None`, or the default value if one is provided.\n\nIf the default value is not a string or `None`, then it will be\ninconsistent with the return type of `os.getenv`, which can lead to\nconfusing behavior.\n\n## Example\n```python\nimport os\n\nint(os.getenv(\"FOO\", 1))\n```\n\nUse instead:\n```python\nimport os\n\nint(os.getenv(\"FOO\", \"1\"))\n```\n"
  },
  {
    "name": "subprocess-popen-preexec-fn",
    "code": "PLW1509",
    "explanation": "## What it does\nChecks for uses of `subprocess.Popen` with a `preexec_fn` argument.\n\n## Why is this bad?\nThe `preexec_fn` argument is unsafe within threads as it can lead to\ndeadlocks. Furthermore, `preexec_fn` is [targeted for deprecation].\n\nInstead, consider using task-specific arguments such as `env`,\n`start_new_session`, and `process_group`. These are not prone to deadlocks\nand are more explicit.\n\n## Example\n```python\nimport os, subprocess\n\nsubprocess.Popen(foo, preexec_fn=os.setsid)\nsubprocess.Popen(bar, preexec_fn=os.setpgid(0, 0))\n```\n\nUse instead:\n```python\nimport subprocess\n\nsubprocess.Popen(foo, start_new_session=True)\nsubprocess.Popen(bar, process_group=0)  # Introduced in Python 3.11\n```\n\n## References\n- [Python documentation: `subprocess.Popen`](https://docs.python.org/3/library/subprocess.html#popen-constructor)\n- [Why `preexec_fn` in `subprocess.Popen` may lead to deadlock?](https://discuss.python.org/t/why-preexec-fn-in-subprocess-popen-may-lead-to-deadlock/16908/2)\n\n[targeted for deprecation]: https://github.com/python/cpython/issues/82616\n"
  },
  {
    "name": "subprocess-run-without-check",
    "code": "PLW1510",
    "explanation": "## What it does\nChecks for uses of `subprocess.run` without an explicit `check` argument.\n\n## Why is this bad?\nBy default, `subprocess.run` does not check the return code of the process\nit runs. This can lead to silent failures.\n\nInstead, consider using `check=True` to raise an exception if the process\nfails, or set `check=False` explicitly to mark the behavior as intentional.\n\n## Example\n```python\nimport subprocess\n\nsubprocess.run([\"ls\", \"nonexistent\"])  # No exception raised.\n```\n\nUse instead:\n```python\nimport subprocess\n\nsubprocess.run([\"ls\", \"nonexistent\"], check=True)  # Raises exception.\n```\n\nOr:\n```python\nimport subprocess\n\nsubprocess.run([\"ls\", \"nonexistent\"], check=False)  # Explicitly no check.\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe for function calls that contain\n`**kwargs`, as adding a `check` keyword argument to such a call may lead\nto a duplicate keyword argument error.\n\n## References\n- [Python documentation: `subprocess.run`](https://docs.python.org/3/library/subprocess.html#subprocess.run)\n",
    "fix": 2
  },
  {
    "name": "unspecified-encoding",
    "code": "PLW1514",
    "explanation": "## What it does\nChecks for uses of `open` and related calls without an explicit `encoding`\nargument.\n\n## Why is this bad?\nUsing `open` in text mode without an explicit encoding can lead to\nnon-portable code, with differing behavior across platforms. While readers\nmay assume that UTF-8 is the default encoding, in reality, the default\nis locale-specific.\n\nInstead, consider using the `encoding` parameter to enforce a specific\nencoding. [PEP 597] recommends the use of `encoding=\"utf-8\"` as a default,\nand suggests that it may become the default in future versions of Python.\n\nIf a locale-specific encoding is intended, use `encoding=\"locale\"`  on\nPython 3.10 and later, or `locale.getpreferredencoding()` on earlier versions,\nto make the encoding explicit.\n\n## Example\n```python\nopen(\"file.txt\")\n```\n\nUse instead:\n```python\nopen(\"file.txt\", encoding=\"utf-8\")\n```\n\n## References\n- [Python documentation: `open`](https://docs.python.org/3/library/functions.html#open)\n\n[PEP 597]: https://peps.python.org/pep-0597/\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "eq-without-hash",
    "code": "PLW1641",
    "explanation": "## What it does\nChecks for classes that implement `__eq__` but not `__hash__`.\n\n## Why is this bad?\nA class that implements `__eq__` but not `__hash__` will have its hash\nmethod implicitly set to `None`, regardless of if a super class defines\n`__hash__`. This will cause the class to be unhashable, will in turn\ncause issues when using the class as a key in a dictionary or a member\nof a set.\n\n## Example\n\n```python\nclass Person:\n    def __init__(self):\n        self.name = \"monty\"\n\n    def __eq__(self, other):\n        return isinstance(other, Person) and other.name == self.name\n```\n\nUse instead:\n\n```python\nclass Person:\n    def __init__(self):\n        self.name = \"monty\"\n\n    def __eq__(self, other):\n        return isinstance(other, Person) and other.name == self.name\n\n    def __hash__(self):\n        return hash(self.name)\n```\n\nThis issue is particularly tricky with inheritance. Even if a parent class correctly implements\nboth `__eq__` and `__hash__`, overriding `__eq__` in a child class without also implementing\n`__hash__` will make the child class unhashable:\n\n```python\nclass Person:\n    def __init__(self):\n        self.name = \"monty\"\n\n    def __eq__(self, other):\n        return isinstance(other, Person) and other.name == self.name\n\n    def __hash__(self):\n        return hash(self.name)\n\n\nclass Developer(Person):\n    def __init__(self):\n        super().__init__()\n        self.language = \"python\"\n\n    def __eq__(self, other):\n        return (\n            super().__eq__(other)\n            and isinstance(other, Developer)\n            and self.language == other.language\n        )\n\n\nhash(Developer())  # TypeError: unhashable type: 'Developer'\n```\n\nOne way to fix this is to retain the implementation of `__hash__` from the parent class:\n\n```python\nclass Developer(Person):\n    def __init__(self):\n        super().__init__()\n        self.language = \"python\"\n\n    def __eq__(self, other):\n        return (\n            super().__eq__(other)\n            and isinstance(other, Developer)\n            and self.language == other.language\n        )\n\n    __hash__ = Person.__hash__\n```\n\n## References\n- [Python documentation: `object.__hash__`](https://docs.python.org/3/reference/datamodel.html#object.__hash__)\n- [Python glossary: hashable](https://docs.python.org/3/glossary.html#term-hashable)\n",
    "preview": true
  },
  {
    "name": "useless-with-lock",
    "code": "PLW2101",
    "explanation": "## What it does\nChecks for lock objects that are created and immediately discarded in\n`with` statements.\n\n## Why is this bad?\nCreating a lock (via `threading.Lock` or similar) in a `with` statement\nhas no effect, as locks are only relevant when shared between threads.\n\nInstead, assign the lock to a variable outside the `with` statement,\nand share that variable between threads.\n\n## Example\n```python\nimport threading\n\ncounter = 0\n\n\ndef increment():\n    global counter\n\n    with threading.Lock():\n        counter += 1\n```\n\nUse instead:\n```python\nimport threading\n\ncounter = 0\nlock = threading.Lock()\n\n\ndef increment():\n    global counter\n\n    with lock:\n        counter += 1\n```\n\n## References\n- [Python documentation: `Lock Objects`](https://docs.python.org/3/library/threading.html#lock-objects)\n"
  },
  {
    "name": "redefined-loop-name",
    "code": "PLW2901",
    "explanation": "## What it does\nChecks for variables defined in `for` loops and `with` statements that\nget overwritten within the body, for example by another `for` loop or\n`with` statement or by direct assignment.\n\n## Why is this bad?\nRedefinition of a loop variable inside the loop's body causes its value\nto differ from the original loop iteration for the remainder of the\nblock, in a way that will likely cause bugs.\n\nIn Python, unlike many other languages, `for` loops and `with`\nstatements don't define their own scopes. Therefore, a nested loop that\nuses the same target variable name as an outer loop will reuse the same\nactual variable, and the value from the last iteration will \"leak out\"\ninto the remainder of the enclosing loop.\n\nWhile this mistake is easy to spot in small examples, it can be hidden\nin larger blocks of code, where the definition and redefinition of the\nvariable may not be visible at the same time.\n\n## Example\n```python\nfor i in range(10):\n    i = 9\n    print(i)  # prints 9 every iteration\n\nfor i in range(10):\n    for i in range(10):  # original value overwritten\n        pass\n    print(i)  # also prints 9 every iteration\n\nwith path1.open() as f:\n    with path2.open() as f:\n        f = path2.open()\n    print(f.readline())  # prints a line from path2\n```\n"
  },
  {
    "name": "bad-dunder-method-name",
    "code": "PLW3201",
    "explanation": "## What it does\nChecks for dunder methods that have no special meaning in Python 3.\n\n## Why is this bad?\nMisspelled or no longer supported dunder name methods may cause your code to not function\nas expected.\n\nSince dunder methods are associated with customizing the behavior\nof a class in Python, introducing a dunder method such as `__foo__`\nthat diverges from standard Python dunder methods could potentially\nconfuse someone reading the code.\n\nThis rule will detect all methods starting and ending with at least\none underscore (e.g., `_str_`), but ignores known dunder methods (like\n`__init__`), as well as methods that are marked with `@override`.\n\nAdditional dunder methods names can be allowed via the\n[`lint.pylint.allow-dunder-method-names`] setting.\n\n## Example\n\n```python\nclass Foo:\n    def __init_(self): ...\n```\n\nUse instead:\n\n```python\nclass Foo:\n    def __init__(self): ...\n```\n\n## Options\n- `lint.pylint.allow-dunder-method-names`\n",
    "preview": true
  },
  {
    "name": "nested-min-max",
    "code": "PLW3301",
    "explanation": "## What it does\nChecks for nested `min` and `max` calls.\n\n## Why is this bad?\nNested `min` and `max` calls can be flattened into a single call to improve\nreadability.\n\n## Example\n```python\nminimum = min(1, 2, min(3, 4, 5))\nmaximum = max(1, 2, max(3, 4, 5))\ndiff = maximum - minimum\n```\n\nUse instead:\n```python\nminimum = min(1, 2, 3, 4, 5)\nmaximum = max(1, 2, 3, 4, 5)\ndiff = maximum - minimum\n```\n\n## References\n- [Python documentation: `min`](https://docs.python.org/3/library/functions.html#min)\n- [Python documentation: `max`](https://docs.python.org/3/library/functions.html#max)\n",
    "fix": 1
  },
  {
    "name": "useless-metaclass-type",
    "code": "UP001",
    "explanation": "## What it does\nChecks for the use of `__metaclass__ = type` in class definitions.\n\n## Why is this bad?\nSince Python 3, `__metaclass__ = type` is implied and can thus be omitted.\n\n## Example\n\n```python\nclass Foo:\n    __metaclass__ = type\n```\n\nUse instead:\n\n```python\nclass Foo: ...\n```\n\n## References\n- [PEP 3115 \u2013 Metaclasses in Python 3000](https://peps.python.org/pep-3115/)\n",
    "fix": 2
  },
  {
    "name": "type-of-primitive",
    "code": "UP003",
    "explanation": "## What it does\nChecks for uses of `type` that take a primitive as an argument.\n\n## Why is this bad?\n`type()` returns the type of a given object. A type of a primitive can\nalways be known in advance and accessed directly, which is more concise\nand explicit than using `type()`.\n\n## Example\n```python\ntype(1)\n```\n\nUse instead:\n```python\nint\n```\n\n## References\n- [Python documentation: `type()`](https://docs.python.org/3/library/functions.html#type)\n- [Python documentation: Built-in types](https://docs.python.org/3/library/stdtypes.html)\n",
    "fix": 1
  },
  {
    "name": "useless-object-inheritance",
    "code": "UP004",
    "explanation": "## What it does\nChecks for classes that inherit from `object`.\n\n## Why is this bad?\nSince Python 3, all classes inherit from `object` by default, so `object` can\nbe omitted from the list of base classes.\n\n## Example\n\n```python\nclass Foo(object): ...\n```\n\nUse instead:\n\n```python\nclass Foo: ...\n```\n\n## References\n- [PEP 3115 \u2013 Metaclasses in Python 3000](https://peps.python.org/pep-3115/)\n",
    "fix": 2
  },
  {
    "name": "deprecated-unittest-alias",
    "code": "UP005",
    "explanation": "## What it does\nChecks for uses of deprecated methods from the `unittest` module.\n\n## Why is this bad?\nThe `unittest` module has deprecated aliases for some of its methods.\nThe deprecated aliases were removed in Python 3.12. Instead of aliases,\nuse their non-deprecated counterparts.\n\n## Example\n```python\nfrom unittest import TestCase\n\n\nclass SomeTest(TestCase):\n    def test_something(self):\n        self.assertEquals(1, 1)\n```\n\nUse instead:\n```python\nfrom unittest import TestCase\n\n\nclass SomeTest(TestCase):\n    def test_something(self):\n        self.assertEqual(1, 1)\n```\n\n## References\n- [Python 3.11 documentation: Deprecated aliases](https://docs.python.org/3.11/library/unittest.html#deprecated-aliases)\n",
    "fix": 2
  },
  {
    "name": "non-pep585-annotation",
    "code": "UP006",
    "explanation": "## What it does\nChecks for the use of generics that can be replaced with standard library\nvariants based on [PEP 585].\n\n## Why is this bad?\n[PEP 585] enabled collections in the Python standard library (like `list`)\nto be used as generics directly, instead of importing analogous members\nfrom the `typing` module (like `typing.List`).\n\nWhen available, the [PEP 585] syntax should be used instead of importing\nmembers from the `typing` module, as it's more concise and readable.\nImporting those members from `typing` is considered deprecated as of [PEP\n585].\n\nThis rule is enabled when targeting Python 3.9 or later (see:\n[`target-version`]). By default, it's _also_ enabled for earlier Python\nversions if `from __future__ import annotations` is present, as\n`__future__` annotations are not evaluated at runtime. If your code relies\non runtime type annotations (either directly or via a library like\nPydantic), you can disable this behavior for Python versions prior to 3.9\nby setting [`lint.pyupgrade.keep-runtime-typing`] to `true`.\n\n## Example\n```python\nfrom typing import List\n\nfoo: List[int] = [1, 2, 3]\n```\n\nUse instead:\n```python\nfoo: list[int] = [1, 2, 3]\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may lead to runtime errors when\nalongside libraries that rely on runtime type annotations, like Pydantic,\non Python versions prior to Python 3.9.\n\n## Options\n- `target-version`\n- `lint.pyupgrade.keep-runtime-typing`\n\n[PEP 585]: https://peps.python.org/pep-0585/\n",
    "fix": 1
  },
  {
    "name": "non-pep604-annotation-union",
    "code": "UP007",
    "explanation": "## What it does\nCheck for type annotations that can be rewritten based on [PEP 604] syntax.\n\n## Why is this bad?\n[PEP 604] introduced a new syntax for union type annotations based on the\n`|` operator. This syntax is more concise and readable than the previous\n`typing.Union` and `typing.Optional` syntaxes.\n\nThis rule is enabled when targeting Python 3.10 or later (see:\n[`target-version`]). By default, it's _also_ enabled for earlier Python\nversions if `from __future__ import annotations` is present, as\n`__future__` annotations are not evaluated at runtime. If your code relies\non runtime type annotations (either directly or via a library like\nPydantic), you can disable this behavior for Python versions prior to 3.10\nby setting [`lint.pyupgrade.keep-runtime-typing`] to `true`.\n\n## Example\n```python\nfrom typing import Union\n\nfoo: Union[int, str] = 1\n```\n\nUse instead:\n```python\nfoo: int | str = 1\n```\n\n## Preview\nIn preview mode, this rule only checks for usages of `typing.Union`,\nwhile `UP045` checks for `typing.Optional`.\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may lead to runtime errors when\nalongside libraries that rely on runtime type annotations, like Pydantic,\non Python versions prior to Python 3.10. It may also lead to runtime errors\nin unusual and likely incorrect type annotations where the type does not\nsupport the `|` operator.\n\n## Options\n- `target-version`\n- `lint.pyupgrade.keep-runtime-typing`\n\n[PEP 604]: https://peps.python.org/pep-0604/\n",
    "fix": 1
  },
  {
    "name": "super-call-with-parameters",
    "code": "UP008",
    "explanation": "## What it does\nChecks for `super` calls that pass redundant arguments.\n\n## Why is this bad?\nIn Python 3, `super` can be invoked without any arguments when: (1) the\nfirst argument is `__class__`, and (2) the second argument is equivalent to\nthe first argument of the enclosing method.\n\nWhen possible, omit the arguments to `super` to make the code more concise\nand maintainable.\n\n## Example\n```python\nclass A:\n    def foo(self):\n        pass\n\n\nclass B(A):\n    def bar(self):\n        super(B, self).foo()\n```\n\nUse instead:\n```python\nclass A:\n    def foo(self):\n        pass\n\n\nclass B(A):\n    def bar(self):\n        super().foo()\n```\n\n## References\n- [Python documentation: `super`](https://docs.python.org/3/library/functions.html#super)\n- [super/MRO, Python's most misunderstood feature.](https://www.youtube.com/watch?v=X1PQ7zzltz4)\n",
    "fix": 2
  },
  {
    "name": "utf8-encoding-declaration",
    "code": "UP009",
    "explanation": "## What it does\nChecks for unnecessary UTF-8 encoding declarations.\n\n## Why is this bad?\n[PEP 3120] makes UTF-8 the default encoding, so a UTF-8 encoding\ndeclaration is unnecessary.\n\n## Example\n```python\n# -*- coding: utf-8 -*-\nprint(\"Hello, world!\")\n```\n\nUse instead:\n```python\nprint(\"Hello, world!\")\n```\n\n[PEP 3120]: https://peps.python.org/pep-3120/\n",
    "fix": 2
  },
  {
    "name": "unnecessary-future-import",
    "code": "UP010",
    "explanation": "## What it does\nChecks for unnecessary `__future__` imports.\n\n## Why is this bad?\nThe `__future__` module is used to enable features that are not yet\navailable in the current Python version. If a feature is already\navailable in the minimum supported Python version, importing it\nfrom `__future__` is unnecessary and should be removed to avoid\nconfusion.\n\n## Example\n```python\nfrom __future__ import print_function\n\nprint(\"Hello, world!\")\n```\n\nUse instead:\n```python\nprint(\"Hello, world!\")\n```\n\n## Options\n- `target-version`\n\n## References\n- [Python documentation: `__future__` \u2014 Future statement definitions](https://docs.python.org/3/library/__future__.html)\n",
    "fix": 2
  },
  {
    "name": "lru-cache-without-parameters",
    "code": "UP011",
    "explanation": "## What it does\nChecks for unnecessary parentheses on `functools.lru_cache` decorators.\n\n## Why is this bad?\nSince Python 3.8, `functools.lru_cache` can be used as a decorator without\ntrailing parentheses, as long as no arguments are passed to it.\n\n## Example\n\n```python\nimport functools\n\n\n@functools.lru_cache()\ndef foo(): ...\n```\n\nUse instead:\n\n```python\nimport functools\n\n\n@functools.lru_cache\ndef foo(): ...\n```\n\n## Options\n- `target-version`\n\n## References\n- [Python documentation: `@functools.lru_cache`](https://docs.python.org/3/library/functools.html#functools.lru_cache)\n- [Let lru_cache be used as a decorator with no arguments](https://github.com/python/cpython/issues/80953)\n",
    "fix": 2
  },
  {
    "name": "unnecessary-encode-utf8",
    "code": "UP012",
    "explanation": "## What it does\nChecks for unnecessary calls to `encode` as UTF-8.\n\n## Why is this bad?\nUTF-8 is the default encoding in Python, so there is no need to call\n`encode` when UTF-8 is the desired encoding. Instead, use a bytes literal.\n\n## Example\n```python\n\"foo\".encode(\"utf-8\")\n```\n\nUse instead:\n```python\nb\"foo\"\n```\n\n## References\n- [Python documentation: `str.encode`](https://docs.python.org/3/library/stdtypes.html#str.encode)\n",
    "fix": 2
  },
  {
    "name": "convert-typed-dict-functional-to-class",
    "code": "UP013",
    "explanation": "## What it does\nChecks for `TypedDict` declarations that use functional syntax.\n\n## Why is this bad?\n`TypedDict` types can be defined either through a functional syntax\n(`Foo = TypedDict(...)`) or a class syntax (`class Foo(TypedDict): ...`).\n\nThe class syntax is more readable and generally preferred over the\nfunctional syntax.\n\nNonetheless, there are some situations in which it is impossible to use\nthe class-based syntax. This rule will not apply to those cases. Namely,\nit is impossible to use the class-based syntax if any `TypedDict` fields are:\n- Not valid [python identifiers] (for example, `@x`)\n- [Python keywords] such as `in`\n- [Private names] such as `__id` that would undergo [name mangling] at runtime\n  if the class-based syntax was used\n- [Dunder names] such as `__int__` that can confuse type checkers if they're used\n  with the class-based syntax.\n\n## Example\n```python\nfrom typing import TypedDict\n\nFoo = TypedDict(\"Foo\", {\"a\": int, \"b\": str})\n```\n\nUse instead:\n```python\nfrom typing import TypedDict\n\n\nclass Foo(TypedDict):\n    a: int\n    b: str\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe if there are any comments within the\nrange of the `TypedDict` definition, as these will be dropped by the\nautofix.\n\n## References\n- [Python documentation: `typing.TypedDict`](https://docs.python.org/3/library/typing.html#typing.TypedDict)\n\n[Private names]: https://docs.python.org/3/tutorial/classes.html#private-variables\n[name mangling]: https://docs.python.org/3/reference/expressions.html#private-name-mangling\n[python identifiers]: https://docs.python.org/3/reference/lexical_analysis.html#identifiers\n[Python keywords]: https://docs.python.org/3/reference/lexical_analysis.html#keywords\n[Dunder names]: https://docs.python.org/3/reference/lexical_analysis.html#reserved-classes-of-identifiers\n",
    "fix": 1
  },
  {
    "name": "convert-named-tuple-functional-to-class",
    "code": "UP014",
    "explanation": "## What it does\nChecks for `NamedTuple` declarations that use functional syntax.\n\n## Why is this bad?\n`NamedTuple` subclasses can be defined either through a functional syntax\n(`Foo = NamedTuple(...)`) or a class syntax (`class Foo(NamedTuple): ...`).\n\nThe class syntax is more readable and generally preferred over the\nfunctional syntax, which exists primarily for backwards compatibility\nwith `collections.namedtuple`.\n\n## Example\n```python\nfrom typing import NamedTuple\n\nFoo = NamedTuple(\"Foo\", [(\"a\", int), (\"b\", str)])\n```\n\nUse instead:\n```python\nfrom typing import NamedTuple\n\n\nclass Foo(NamedTuple):\n    a: int\n    b: str\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe if there are any comments within the\nrange of the `NamedTuple` definition, as these will be dropped by the\nautofix.\n\n## References\n- [Python documentation: `typing.NamedTuple`](https://docs.python.org/3/library/typing.html#typing.NamedTuple)\n",
    "fix": 1
  },
  {
    "name": "redundant-open-modes",
    "code": "UP015",
    "explanation": "## What it does\nChecks for redundant `open` mode arguments.\n\n## Why is this bad?\nRedundant `open` mode arguments are unnecessary and should be removed to\navoid confusion.\n\n## Example\n```python\nwith open(\"foo.txt\", \"r\") as f:\n    ...\n```\n\nUse instead:\n```python\nwith open(\"foo.txt\") as f:\n    ...\n```\n\n## References\n- [Python documentation: `open`](https://docs.python.org/3/library/functions.html#open)\n",
    "fix": 2
  },
  {
    "name": "datetime-timezone-utc",
    "code": "UP017",
    "explanation": "## What it does\nChecks for uses of `datetime.timezone.utc`.\n\n## Why is this bad?\nAs of Python 3.11, `datetime.UTC` is an alias for `datetime.timezone.utc`.\nThe alias is more readable and generally preferred over the full path.\n\n## Example\n```python\nimport datetime\n\ndatetime.timezone.utc\n```\n\nUse instead:\n```python\nimport datetime\n\ndatetime.UTC\n```\n\n## Options\n- `target-version`\n\n## References\n- [Python documentation: `datetime.UTC`](https://docs.python.org/3/library/datetime.html#datetime.UTC)\n",
    "fix": 1
  },
  {
    "name": "native-literals",
    "code": "UP018",
    "explanation": "## What it does\nChecks for unnecessary calls to `str`, `bytes`, `int`, `float`, and `bool`.\n\n## Why is this bad?\nThe mentioned constructors can be replaced with their respective literal\nforms, which are more readable and idiomatic.\n\n## Example\n```python\nstr(\"foo\")\n```\n\nUse instead:\n```python\n\"foo\"\n```\n\n## Fix safety\nThe fix is marked as unsafe if it might remove comments.\n\n## References\n- [Python documentation: `str`](https://docs.python.org/3/library/stdtypes.html#str)\n- [Python documentation: `bytes`](https://docs.python.org/3/library/stdtypes.html#bytes)\n- [Python documentation: `int`](https://docs.python.org/3/library/functions.html#int)\n- [Python documentation: `float`](https://docs.python.org/3/library/functions.html#float)\n- [Python documentation: `bool`](https://docs.python.org/3/library/functions.html#bool)\n",
    "fix": 2
  },
  {
    "name": "typing-text-str-alias",
    "code": "UP019",
    "explanation": "## What it does\nChecks for uses of `typing.Text`.\n\n## Why is this bad?\n`typing.Text` is an alias for `str`, and only exists for Python 2\ncompatibility. As of Python 3.11, `typing.Text` is deprecated. Use `str`\ninstead.\n\n## Example\n```python\nfrom typing import Text\n\nfoo: Text = \"bar\"\n```\n\nUse instead:\n```python\nfoo: str = \"bar\"\n```\n\n## References\n- [Python documentation: `typing.Text`](https://docs.python.org/3/library/typing.html#typing.Text)\n",
    "fix": 1
  },
  {
    "name": "open-alias",
    "code": "UP020",
    "explanation": "## What it does\nChecks for uses of `io.open`.\n\n## Why is this bad?\nIn Python 3, `io.open` is an alias for `open`. Prefer using `open` directly,\nas it is more idiomatic.\n\n## Example\n```python\nimport io\n\nwith io.open(\"file.txt\") as f:\n    ...\n```\n\nUse instead:\n```python\nwith open(\"file.txt\") as f:\n    ...\n```\n\n## References\n- [Python documentation: `io.open`](https://docs.python.org/3/library/io.html#io.open)\n",
    "fix": 1
  },
  {
    "name": "replace-universal-newlines",
    "code": "UP021",
    "explanation": "## What it does\nChecks for uses of `subprocess.run` that set the `universal_newlines`\nkeyword argument.\n\n## Why is this bad?\nAs of Python 3.7, the `universal_newlines` keyword argument has been\nrenamed to `text`, and now exists for backwards compatibility. The\n`universal_newlines` keyword argument may be removed in a future version of\nPython. Prefer `text`, which is more explicit and readable.\n\n## Example\n```python\nimport subprocess\n\nsubprocess.run([\"foo\"], universal_newlines=True)\n```\n\nUse instead:\n```python\nimport subprocess\n\nsubprocess.run([\"foo\"], text=True)\n```\n\n## References\n- [Python 3.7 release notes](https://docs.python.org/3/whatsnew/3.7.html#subprocess)\n- [Python documentation: `subprocess.run`](https://docs.python.org/3/library/subprocess.html#subprocess.run)\n",
    "fix": 2
  },
  {
    "name": "replace-stdout-stderr",
    "code": "UP022",
    "explanation": "## What it does\nChecks for uses of `subprocess.run` that send `stdout` and `stderr` to a\npipe.\n\n## Why is this bad?\nAs of Python 3.7, `subprocess.run` has a `capture_output` keyword argument\nthat can be set to `True` to capture `stdout` and `stderr` outputs. This is\nequivalent to setting `stdout` and `stderr` to `subprocess.PIPE`, but is\nmore explicit and readable.\n\n## Example\n```python\nimport subprocess\n\nsubprocess.run([\"foo\"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)\n```\n\nUse instead:\n```python\nimport subprocess\n\nsubprocess.run([\"foo\"], capture_output=True)\n```\n\n## References\n- [Python 3.7 release notes](https://docs.python.org/3/whatsnew/3.7.html#subprocess)\n- [Python documentation: `subprocess.run`](https://docs.python.org/3/library/subprocess.html#subprocess.run)\n",
    "fix": 1
  },
  {
    "name": "deprecated-c-element-tree",
    "code": "UP023",
    "explanation": "## What it does\nChecks for uses of the `xml.etree.cElementTree` module.\n\n## Why is this bad?\nIn Python 3.3, `xml.etree.cElementTree` was deprecated in favor of\n`xml.etree.ElementTree`.\n\n## Example\n```python\nfrom xml.etree import cElementTree\n```\n\nUse instead:\n```python\nfrom xml.etree import ElementTree\n```\n\n## References\n- [Python documentation: `xml.etree.ElementTree`](https://docs.python.org/3/library/xml.etree.elementtree.html)\n",
    "fix": 2
  },
  {
    "name": "os-error-alias",
    "code": "UP024",
    "explanation": "## What it does\nChecks for uses of exceptions that alias `OSError`.\n\n## Why is this bad?\n`OSError` is the builtin error type used for exceptions that relate to the\noperating system.\n\nIn Python 3.3, a variety of other exceptions, like `WindowsError` were\naliased to `OSError`. These aliases remain in place for compatibility with\nolder versions of Python, but may be removed in future versions.\n\nPrefer using `OSError` directly, as it is more idiomatic and future-proof.\n\n## Example\n```python\nraise IOError\n```\n\nUse instead:\n```python\nraise OSError\n```\n\n## References\n- [Python documentation: `OSError`](https://docs.python.org/3/library/exceptions.html#OSError)\n",
    "fix": 2
  },
  {
    "name": "unicode-kind-prefix",
    "code": "UP025",
    "explanation": "## What it does\nChecks for uses of the Unicode kind prefix (`u`) in strings.\n\n## Why is this bad?\nIn Python 3, all strings are Unicode by default. The Unicode kind prefix is\nunnecessary and should be removed to avoid confusion.\n\n## Example\n```python\nu\"foo\"\n```\n\nUse instead:\n```python\n\"foo\"\n```\n\n## References\n- [Python documentation: Unicode HOWTO](https://docs.python.org/3/howto/unicode.html)\n",
    "fix": 2
  },
  {
    "name": "deprecated-mock-import",
    "code": "UP026",
    "explanation": "## What it does\nChecks for imports of the `mock` module that should be replaced with\n`unittest.mock`.\n\n## Why is this bad?\nSince Python 3.3, `mock` has been a part of the standard library as\n`unittest.mock`. The `mock` package is deprecated; use `unittest.mock`\ninstead.\n\n## Example\n```python\nimport mock\n```\n\nUse instead:\n```python\nfrom unittest import mock\n```\n\n## References\n- [Python documentation: `unittest.mock`](https://docs.python.org/3/library/unittest.mock.html)\n- [PyPI: `mock`](https://pypi.org/project/mock/)\n",
    "fix": 2
  },
  {
    "name": "unpacked-list-comprehension",
    "code": "UP027",
    "explanation": "## Removed\nThere's no [evidence](https://github.com/astral-sh/ruff/issues/12754) that generators are\nmeaningfully faster than list comprehensions when combined with unpacking.\n\n## What it does\nChecks for list comprehensions that are immediately unpacked.\n\n## Why is this bad?\nThere is no reason to use a list comprehension if the result is immediately\nunpacked. Instead, use a generator expression, which avoids allocating\nan intermediary list.\n\n## Example\n```python\na, b, c = [foo(x) for x in items]\n```\n\nUse instead:\n```python\na, b, c = (foo(x) for x in items)\n```\n\n## References\n- [Python documentation: Generator expressions](https://docs.python.org/3/reference/expressions.html#generator-expressions)\n- [Python documentation: List comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)\n"
  },
  {
    "name": "yield-in-for-loop",
    "code": "UP028",
    "explanation": "## What it does\nChecks for `for` loops that can be replaced with `yield from` expressions.\n\n## Why is this bad?\nIf a `for` loop only contains a `yield` statement, it can be replaced with a\n`yield from` expression, which is more concise and idiomatic.\n\n## Example\n```python\nfor x in foo:\n    yield x\n\nglobal y\nfor y in foo:\n    yield y\n```\n\nUse instead:\n```python\nyield from foo\n\nfor _element in foo:\n    y = _element\n    yield y\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as converting a `for` loop to a `yield\nfrom` expression can change the behavior of the program in rare cases.\nFor example, if a generator is being sent values via `send`, then rewriting\nto a `yield from` could lead to an attribute error if the underlying\ngenerator does not implement the `send` method.\n\nAdditionally, if at least one target is `global` or `nonlocal`,\nno fix will be offered.\n\nIn most cases, however, the fix is safe, and such a modification should have\nno effect on the behavior of the program.\n\n## References\n- [Python documentation: The `yield` statement](https://docs.python.org/3/reference/simple_stmts.html#the-yield-statement)\n- [PEP 380 \u2013 Syntax for Delegating to a Subgenerator](https://peps.python.org/pep-0380/)\n",
    "fix": 1
  },
  {
    "name": "unnecessary-builtin-import",
    "code": "UP029",
    "explanation": "## What it does\nChecks for unnecessary imports of builtins.\n\n## Why is this bad?\nBuiltins are always available. Importing them is unnecessary and should be\nremoved to avoid confusion.\n\n## Example\n```python\nfrom builtins import str\n\nstr(1)\n```\n\nUse instead:\n```python\nstr(1)\n```\n\n## References\n- [Python documentation: The Python Standard Library](https://docs.python.org/3/library/index.html)\n",
    "fix": 2
  },
  {
    "name": "format-literals",
    "code": "UP030",
    "explanation": "## What it does\nChecks for unnecessary positional indices in format strings.\n\n## Why is this bad?\nIn Python 3.1 and later, format strings can use implicit positional\nreferences. For example, `\"{0}, {1}\".format(\"Hello\", \"World\")` can be\nrewritten as `\"{}, {}\".format(\"Hello\", \"World\")`.\n\nIf the positional indices appear exactly in-order, they can be omitted\nin favor of automatic indices to improve readability.\n\n## Example\n```python\n\"{0}, {1}\".format(\"Hello\", \"World\")  # \"Hello, World\"\n```\n\nUse instead:\n```python\n\"{}, {}\".format(\"Hello\", \"World\")  # \"Hello, World\"\n```\n\n## References\n- [Python documentation: Format String Syntax](https://docs.python.org/3/library/string.html#format-string-syntax)\n- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)\n",
    "fix": 1
  },
  {
    "name": "printf-string-formatting",
    "code": "UP031",
    "explanation": "## What it does\nChecks for `printf`-style string formatting, and offers to replace it with\n`str.format` calls.\n\n## Why is this bad?\n`printf`-style string formatting has a number of quirks, and leads to less\nreadable code than using `str.format` calls or f-strings. In general, prefer\nthe newer `str.format` and f-strings constructs over `printf`-style string\nformatting.\n\n## Example\n\n```python\n\"%s, %s\" % (\"Hello\", \"World\")  # \"Hello, World\"\n```\n\nUse instead:\n\n```python\n\"{}, {}\".format(\"Hello\", \"World\")  # \"Hello, World\"\n```\n\n```python\nf\"{'Hello'}, {'World'}\"  # \"Hello, World\"\n```\n\n## Fix safety\n\nIn cases where the format string contains a single generic format specifier\n(e.g. `%s`), and the right-hand side is an ambiguous expression,\nwe cannot offer a safe fix.\n\nFor example, given:\n\n```python\n\"%s\" % val\n```\n\n`val` could be a single-element tuple, _or_ a single value (not\ncontained in a tuple). Both of these would resolve to the same\nformatted string when using `printf`-style formatting, but\nresolve differently when using f-strings:\n\n```python\nval = 1\nprint(\"%s\" % val)  # \"1\"\nprint(\"{}\".format(val))  # \"1\"\n\nval = (1,)\nprint(\"%s\" % val)  # \"1\"\nprint(\"{}\".format(val))  # \"(1,)\"\n```\n\n## References\n- [Python documentation: `printf`-style String Formatting](https://docs.python.org/3/library/stdtypes.html#old-string-formatting)\n- [Python documentation: `str.format`](https://docs.python.org/3/library/stdtypes.html#str.format)\n",
    "fix": 1
  },
  {
    "name": "f-string",
    "code": "UP032",
    "explanation": "## What it does\nChecks for `str.format` calls that can be replaced with f-strings.\n\n## Why is this bad?\nf-strings are more readable and generally preferred over `str.format`\ncalls.\n\n## Example\n```python\n\"{}\".format(foo)\n```\n\nUse instead:\n```python\nf\"{foo}\"\n```\n\n## References\n- [Python documentation: f-strings](https://docs.python.org/3/reference/lexical_analysis.html#f-strings)\n",
    "fix": 1
  },
  {
    "name": "lru-cache-with-maxsize-none",
    "code": "UP033",
    "explanation": "## What it does\nChecks for uses of `functools.lru_cache` that set `maxsize=None`.\n\n## Why is this bad?\nSince Python 3.9, `functools.cache` can be used as a drop-in replacement\nfor `functools.lru_cache(maxsize=None)`. When possible, prefer\n`functools.cache` as it is more readable and idiomatic.\n\n## Example\n\n```python\nimport functools\n\n\n@functools.lru_cache(maxsize=None)\ndef foo(): ...\n```\n\nUse instead:\n\n```python\nimport functools\n\n\n@functools.cache\ndef foo(): ...\n```\n\n## Options\n- `target-version`\n\n## References\n- [Python documentation: `@functools.cache`](https://docs.python.org/3/library/functools.html#functools.cache)\n",
    "fix": 2
  },
  {
    "name": "extraneous-parentheses",
    "code": "UP034",
    "explanation": "## What it does\nChecks for extraneous parentheses.\n\n## Why is this bad?\nExtraneous parentheses are redundant, and can be removed to improve\nreadability while retaining identical semantics.\n\n## Example\n```python\nprint((\"Hello, world\"))\n```\n\nUse instead:\n```python\nprint(\"Hello, world\")\n```\n",
    "fix": 2
  },
  {
    "name": "deprecated-import",
    "code": "UP035",
    "explanation": "## What it does\nChecks for uses of deprecated imports based on the minimum supported\nPython version.\n\n## Why is this bad?\nDeprecated imports may be removed in future versions of Python, and\nshould be replaced with their new equivalents.\n\nNote that, in some cases, it may be preferable to continue importing\nmembers from `typing_extensions` even after they're added to the Python\nstandard library, as `typing_extensions` can backport bugfixes and\noptimizations from later Python versions. This rule thus avoids flagging\nimports from `typing_extensions` in such cases.\n\n## Example\n```python\nfrom collections import Sequence\n```\n\nUse instead:\n```python\nfrom collections.abc import Sequence\n```\n",
    "fix": 1
  },
  {
    "name": "outdated-version-block",
    "code": "UP036",
    "explanation": "## What it does\nChecks for conditional blocks gated on `sys.version_info` comparisons\nthat are outdated for the minimum supported Python version.\n\n## Why is this bad?\nIn Python, code can be conditionally executed based on the active\nPython version by comparing against the `sys.version_info` tuple.\n\nIf a code block is only executed for Python versions older than the\nminimum supported version, it should be removed.\n\n## Example\n```python\nimport sys\n\nif sys.version_info < (3, 0):\n    print(\"py2\")\nelse:\n    print(\"py3\")\n```\n\nUse instead:\n```python\nprint(\"py3\")\n```\n\n## Options\n- `target-version`\n\n## References\n- [Python documentation: `sys.version_info`](https://docs.python.org/3/library/sys.html#sys.version_info)\n",
    "fix": 1
  },
  {
    "name": "quoted-annotation",
    "code": "UP037",
    "explanation": "## What it does\nChecks for the presence of unnecessary quotes in type annotations.\n\n## Why is this bad?\nIn Python, type annotations can be quoted to avoid forward references.\n\nHowever, if `from __future__ import annotations` is present, Python\nwill always evaluate type annotations in a deferred manner, making\nthe quotes unnecessary.\n\nSimilarly, if the annotation is located in a typing-only context and\nwon't be evaluated by Python at runtime, the quotes will also be\nconsidered unnecessary. For example, Python does not evaluate type\nannotations on assignments in function bodies.\n\n## Example\n\nGiven:\n\n```python\nfrom __future__ import annotations\n\n\ndef foo(bar: \"Bar\") -> \"Bar\": ...\n```\n\nUse instead:\n\n```python\nfrom __future__ import annotations\n\n\ndef foo(bar: Bar) -> Bar: ...\n```\n\nGiven:\n\n```python\ndef foo() -> None:\n    bar: \"Bar\"\n```\n\nUse instead:\n\n```python\ndef foo() -> None:\n    bar: Bar\n```\n\n## See also\n- [`quoted-annotation-in-stub`][PYI020]: A rule that\n  removes all quoted annotations from stub files\n- [`quoted-type-alias`][TC008]: A rule that removes unnecessary quotes\n  from type aliases.\n\n## References\n- [PEP 563 \u2013 Postponed Evaluation of Annotations](https://peps.python.org/pep-0563/)\n- [Python documentation: `__future__`](https://docs.python.org/3/library/__future__.html#module-__future__)\n\n[PYI020]: https://docs.astral.sh/ruff/rules/quoted-annotation-in-stub/\n[TC008]: https://docs.astral.sh/ruff/rules/quoted-type-alias/\n",
    "fix": 2
  },
  {
    "name": "non-pep604-isinstance",
    "code": "UP038",
    "explanation": "## Deprecation\nThis rule was deprecated as using [PEP 604] syntax in `isinstance` and `issubclass` calls\nisn't recommended practice, and it incorrectly suggests that other typing syntaxes like [PEP 695]\nwould be supported by `isinstance` and `issubclass`. Using the [PEP 604] syntax\nis also slightly slower.\n\n## What it does\nChecks for uses of `isinstance` and `issubclass` that take a tuple\nof types for comparison.\n\n## Why is this bad?\nSince Python 3.10, `isinstance` and `issubclass` can be passed a\n`|`-separated union of types, which is consistent\nwith the union operator introduced in [PEP 604].\n\nNote that this results in slower code. Ignore this rule if the\nperformance of an `isinstance` or `issubclass` check is a\nconcern, e.g., in a hot loop.\n\n## Example\n```python\nisinstance(x, (int, float))\n```\n\nUse instead:\n```python\nisinstance(x, int | float)\n```\n\n## Options\n- `target-version`\n\n## References\n- [Python documentation: `isinstance`](https://docs.python.org/3/library/functions.html#isinstance)\n- [Python documentation: `issubclass`](https://docs.python.org/3/library/functions.html#issubclass)\n\n[PEP 604]: https://peps.python.org/pep-0604/\n[PEP 695]: https://peps.python.org/pep-0695/\n",
    "fix": 2
  },
  {
    "name": "unnecessary-class-parentheses",
    "code": "UP039",
    "explanation": "## What it does\nChecks for class definitions that include unnecessary parentheses after\nthe class name.\n\n## Why is this bad?\nIf a class definition doesn't have any bases, the parentheses are\nunnecessary.\n\n## Example\n```python\nclass Foo():\n    ...\n```\n\nUse instead:\n```python\nclass Foo:\n    ...\n```\n",
    "fix": 2
  },
  {
    "name": "non-pep695-type-alias",
    "code": "UP040",
    "explanation": "## What it does\nChecks for use of `TypeAlias` annotations and `TypeAliasType` assignments\nfor declaring type aliases.\n\n## Why is this bad?\nThe `type` keyword was introduced in Python 3.12 by [PEP 695] for defining\ntype aliases. The `type` keyword is easier to read and provides cleaner\nsupport for generics.\n\n## Known problems\n[PEP 695] uses inferred variance for type parameters, instead of the\n`covariant` and `contravariant` keywords used by `TypeVar` variables. As\nsuch, rewriting a type alias using a PEP-695 `type` statement may change\nthe variance of the alias's type parameters.\n\nUnlike type aliases that use simple assignments, definitions created using\n[PEP 695] `type` statements cannot be used as drop-in replacements at\nruntime for the value on the right-hand side of the statement. This means\nthat while for some simple old-style type aliases you can use them as the\nsecond argument to an `isinstance()` call (for example), doing the same\nwith a [PEP 695] `type` statement will always raise `TypeError` at\nruntime.\n\n## Example\n```python\nListOfInt: TypeAlias = list[int]\nPositiveInt = TypeAliasType(\"PositiveInt\", Annotated[int, Gt(0)])\n```\n\nUse instead:\n```python\ntype ListOfInt = list[int]\ntype PositiveInt = Annotated[int, Gt(0)]\n```\n\n## Fix safety\n\nThis fix is marked unsafe for `TypeAlias` assignments outside of stub files because of the\nruntime behavior around `isinstance()` calls noted above. The fix is also unsafe for\n`TypeAliasType` assignments if there are any comments in the replacement range that would be\ndeleted.\n\n## See also\n\nThis rule only applies to `TypeAlias`es and `TypeAliasType`s. See\n[`non-pep695-generic-class`][UP046] and [`non-pep695-generic-function`][UP047] for similar\ntransformations for generic classes and functions.\n\nThis rule replaces standalone type variables in aliases but doesn't remove the corresponding\ntype variables even if they are unused after the fix. See [`unused-private-type-var`][PYI018]\nfor a rule to clean up unused private type variables.\n\nThis rule will not rename private type variables to remove leading underscores, even though the\nnew type parameters are restricted in scope to their associated aliases. See\n[`private-type-parameter`][UP049] for a rule to update these names.\n\n[PEP 695]: https://peps.python.org/pep-0695/\n[PYI018]: https://docs.astral.sh/ruff/rules/unused-private-type-var/\n[UP046]: https://docs.astral.sh/ruff/rules/non-pep695-generic-class/\n[UP047]: https://docs.astral.sh/ruff/rules/non-pep695-generic-function/\n[UP049]: https://docs.astral.sh/ruff/rules/private-type-parameter/\n",
    "fix": 2
  },
  {
    "name": "timeout-error-alias",
    "code": "UP041",
    "explanation": "## What it does\nChecks for uses of exceptions that alias `TimeoutError`.\n\n## Why is this bad?\n`TimeoutError` is the builtin error type used for exceptions when a system\nfunction timed out at the system level.\n\nIn Python 3.10, `socket.timeout` was aliased to `TimeoutError`. In Python\n3.11, `asyncio.TimeoutError` was aliased to `TimeoutError`.\n\nThese aliases remain in place for compatibility with older versions of\nPython, but may be removed in future versions.\n\nPrefer using `TimeoutError` directly, as it is more idiomatic and future-proof.\n\n## Example\n```python\nraise asyncio.TimeoutError\n```\n\nUse instead:\n```python\nraise TimeoutError\n```\n\n## References\n- [Python documentation: `TimeoutError`](https://docs.python.org/3/library/exceptions.html#TimeoutError)\n",
    "fix": 2
  },
  {
    "name": "replace-str-enum",
    "code": "UP042",
    "explanation": "## What it does\nChecks for classes that inherit from both `str` and `enum.Enum`.\n\n## Why is this bad?\nPython 3.11 introduced `enum.StrEnum`, which is preferred over inheriting\nfrom both `str` and `enum.Enum`.\n\n## Example\n\n```python\nimport enum\n\n\nclass Foo(str, enum.Enum): ...\n```\n\nUse instead:\n\n```python\nimport enum\n\n\nclass Foo(enum.StrEnum): ...\n```\n\n## Fix safety\n\nPython 3.11 introduced a [breaking change] for enums that inherit from both\n`str` and `enum.Enum`. Consider the following enum:\n\n```python\nfrom enum import Enum\n\n\nclass Foo(str, Enum):\n    BAR = \"bar\"\n```\n\nIn Python 3.11, the formatted representation of `Foo.BAR` changed as\nfollows:\n\n```python\n# Python 3.10\nf\"{Foo.BAR}\"  # > bar\n# Python 3.11\nf\"{Foo.BAR}\"  # > Foo.BAR\n```\n\nMigrating from `str` and `enum.Enum` to `enum.StrEnum` will restore the\nprevious behavior, such that:\n\n```python\nfrom enum import StrEnum\n\n\nclass Foo(StrEnum):\n    BAR = \"bar\"\n\n\nf\"{Foo.BAR}\"  # > bar\n```\n\nAs such, migrating to `enum.StrEnum` will introduce a behavior change for\ncode that relies on the Python 3.11 behavior.\n\n## References\n- [enum.StrEnum](https://docs.python.org/3/library/enum.html#enum.StrEnum)\n\n[breaking change]: https://blog.pecar.me/python-enum\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "unnecessary-default-type-args",
    "code": "UP043",
    "explanation": "## What it does\nChecks for unnecessary default type arguments for `Generator` and\n`AsyncGenerator` on Python 3.13+.\n\n## Why is this bad?\nPython 3.13 introduced the ability for type parameters to specify default\nvalues. Following this change, several standard-library classes were\nupdated to add default values for some of their type parameters. For\nexample, `Generator[int]` is now equivalent to\n`Generator[int, None, None]`, as the second and third type parameters of\n`Generator` now default to `None`.\n\nOmitting type arguments that match the default values can make the code\nmore concise and easier to read.\n\n## Example\n\n```python\nfrom collections.abc import Generator, AsyncGenerator\n\n\ndef sync_gen() -> Generator[int, None, None]:\n    yield 42\n\n\nasync def async_gen() -> AsyncGenerator[int, None]:\n    yield 42\n```\n\nUse instead:\n\n```python\nfrom collections.abc import Generator, AsyncGenerator\n\n\ndef sync_gen() -> Generator[int]:\n    yield 42\n\n\nasync def async_gen() -> AsyncGenerator[int]:\n    yield 42\n```\n\n## Fix safety\nThis rule's fix is marked as safe, unless the type annotation contains comments.\n\n## Options\n- `target-version`\n\n## References\n- [PEP 696 \u2013 Type Defaults for Type Parameters](https://peps.python.org/pep-0696/)\n- [Annotating generators and coroutines](https://docs.python.org/3/library/typing.html#annotating-generators-and-coroutines)\n- [Python documentation: `typing.Generator`](https://docs.python.org/3/library/typing.html#typing.Generator)\n- [Python documentation: `typing.AsyncGenerator`](https://docs.python.org/3/library/typing.html#typing.AsyncGenerator)\n",
    "fix": 2
  },
  {
    "name": "non-pep646-unpack",
    "code": "UP044",
    "explanation": "## What it does\nChecks for uses of `Unpack[]` on Python 3.11 and above, and suggests\nusing `*` instead.\n\n## Why is this bad?\n[PEP 646] introduced a new syntax for unpacking sequences based on the `*`\noperator. This syntax is more concise and readable than the previous\n`Unpack[]` syntax.\n\n## Example\n```python\nfrom typing import Unpack\n\n\ndef foo(*args: Unpack[tuple[int, ...]]) -> None:\n    pass\n```\n\nUse instead:\n```python\ndef foo(*args: *tuple[int, ...]) -> None:\n    pass\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as `Unpack[T]` and `*T` are considered\ndifferent values when introspecting types at runtime. However, in most cases,\nthe fix should be safe to apply.\n\n[PEP 646]: https://peps.python.org/pep-0646/\n",
    "fix": 2
  },
  {
    "name": "non-pep604-annotation-optional",
    "code": "UP045",
    "explanation": "## What it does\nCheck for `typing.Optional` annotations that can be rewritten based on [PEP 604] syntax.\n\n## Why is this bad?\n[PEP 604] introduced a new syntax for union type annotations based on the\n`|` operator. This syntax is more concise and readable than the previous\n`typing.Optional` syntax.\n\nThis rule is enabled when targeting Python 3.10 or later (see:\n[`target-version`]). By default, it's _also_ enabled for earlier Python\nversions if `from __future__ import annotations` is present, as\n`__future__` annotations are not evaluated at runtime. If your code relies\non runtime type annotations (either directly or via a library like\nPydantic), you can disable this behavior for Python versions prior to 3.10\nby setting [`lint.pyupgrade.keep-runtime-typing`] to `true`.\n\n## Example\n```python\nfrom typing import Optional\n\nfoo: Optional[int] = None\n```\n\nUse instead:\n```python\nfoo: int | None = None\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it may lead to runtime errors when\nalongside libraries that rely on runtime type annotations, like Pydantic,\non Python versions prior to Python 3.10. It may also lead to runtime errors\nin unusual and likely incorrect type annotations where the type does not\nsupport the `|` operator.\n\n## Options\n- `target-version`\n- `lint.pyupgrade.keep-runtime-typing`\n\n[PEP 604]: https://peps.python.org/pep-0604/\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "non-pep695-generic-class",
    "code": "UP046",
    "explanation": "## What it does\n\nChecks for use of standalone type variables and parameter specifications in generic classes.\n\n## Why is this bad?\n\nSpecial type parameter syntax was introduced in Python 3.12 by [PEP 695] for defining generic\nclasses. This syntax is easier to read and provides cleaner support for generics.\n\n## Known problems\n\nThe rule currently skips generic classes nested inside of other functions or classes. It also\nskips type parameters with the `default` argument introduced in [PEP 696] and implemented in\nPython 3.13.\n\nThis rule can only offer a fix if all of the generic types in the class definition are defined\nin the current module. For external type parameters, a diagnostic is emitted without a suggested\nfix.\n\nNot all type checkers fully support PEP 695 yet, so even valid fixes suggested by this rule may\ncause type checking to fail.\n\n## Fix safety\n\nThis fix is marked as unsafe, as [PEP 695] uses inferred variance for type parameters, instead\nof the `covariant` and `contravariant` keywords used by `TypeVar` variables. As such, replacing\na `TypeVar` variable with an inline type parameter may change its variance.\n\n## Example\n\n```python\nfrom typing import TypeVar\n\nT = TypeVar(\"T\")\n\n\nclass GenericClass(Generic[T]):\n    var: T\n```\n\nUse instead:\n\n```python\nclass GenericClass[T]:\n    var: T\n```\n\n## See also\n\nThis rule replaces standalone type variables in classes but doesn't remove\nthe corresponding type variables even if they are unused after the fix. See\n[`unused-private-type-var`][PYI018] for a rule to clean up unused\nprivate type variables.\n\nThis rule will not rename private type variables to remove leading underscores, even though the\nnew type parameters are restricted in scope to their associated class. See\n[`private-type-parameter`][UP049] for a rule to update these names.\n\nThis rule will correctly handle classes with multiple base classes, as long as the single\n`Generic` base class is at the end of the argument list, as checked by\n[`generic-not-last-base-class`][PYI059]. If a `Generic` base class is\nfound outside of the last position, a diagnostic is emitted without a suggested fix.\n\nThis rule only applies to generic classes and does not include generic functions. See\n[`non-pep695-generic-function`][UP047] for the function version.\n\n[PEP 695]: https://peps.python.org/pep-0695/\n[PEP 696]: https://peps.python.org/pep-0696/\n[PYI018]: https://docs.astral.sh/ruff/rules/unused-private-type-var/\n[PYI059]: https://docs.astral.sh/ruff/rules/generic-not-last-base-class/\n[UP047]: https://docs.astral.sh/ruff/rules/non-pep695-generic-function/\n[UP049]: https://docs.astral.sh/ruff/rules/private-type-parameter/\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "non-pep695-generic-function",
    "code": "UP047",
    "explanation": "## What it does\n\nChecks for use of standalone type variables and parameter specifications in generic functions.\n\n## Why is this bad?\n\nSpecial type parameter syntax was introduced in Python 3.12 by [PEP 695] for defining generic\nfunctions. This syntax is easier to read and provides cleaner support for generics.\n\n## Known problems\n\nThe rule currently skips generic functions nested inside of other functions or classes and those\nwith type parameters containing the `default` argument introduced in [PEP 696] and implemented\nin Python 3.13.\n\nNot all type checkers fully support PEP 695 yet, so even valid fixes suggested by this rule may\ncause type checking to fail.\n\n## Fix safety\n\nThis fix is marked unsafe, as [PEP 695] uses inferred variance for type parameters, instead of\nthe `covariant` and `contravariant` keywords used by `TypeVar` variables. As such, replacing a\n`TypeVar` variable with an inline type parameter may change its variance.\n\nAdditionally, if the rule cannot determine whether a parameter annotation corresponds to a type\nvariable (e.g. for a type imported from another module), it will not add the type to the generic\ntype parameter list. This causes the function to have a mix of old-style type variables and\nnew-style generic type parameters, which will be rejected by type checkers.\n\n## Example\n\n```python\nfrom typing import TypeVar\n\nT = TypeVar(\"T\")\n\n\ndef generic_function(var: T) -> T:\n    return var\n```\n\nUse instead:\n\n```python\ndef generic_function[T](var: T) -> T:\n    return var\n```\n\n## See also\n\nThis rule replaces standalone type variables in function signatures but doesn't remove\nthe corresponding type variables even if they are unused after the fix. See\n[`unused-private-type-var`][PYI018] for a rule to clean up unused\nprivate type variables.\n\nThis rule will not rename private type variables to remove leading underscores, even though the\nnew type parameters are restricted in scope to their associated function. See\n[`private-type-parameter`][UP049] for a rule to update these names.\n\nThis rule only applies to generic functions and does not include generic classes. See\n[`non-pep695-generic-class`][UP046] for the class version.\n\n[PEP 695]: https://peps.python.org/pep-0695/\n[PEP 696]: https://peps.python.org/pep-0696/\n[PYI018]: https://docs.astral.sh/ruff/rules/unused-private-type-var/\n[UP046]: https://docs.astral.sh/ruff/rules/non-pep695-generic-class/\n[UP049]: https://docs.astral.sh/ruff/rules/private-type-parameter/\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "private-type-parameter",
    "code": "UP049",
    "explanation": "## What it does\n\nChecks for use of [PEP 695] type parameters with leading underscores in generic classes and\nfunctions.\n\n## Why is this bad?\n\n[PEP 695] type parameters are already restricted in scope to the class or function in which they\nappear, so leading underscores just hurt readability without the usual privacy benefits.\n\nHowever, neither a diagnostic nor a fix will be emitted for \"sunder\" (`_T_`) or \"dunder\"\n(`__T__`) type parameter names as these are not considered private.\n\n## Example\n\n```python\nclass GenericClass[_T]:\n    var: _T\n\n\ndef generic_function[_T](var: _T) -> list[_T]:\n    return var[0]\n```\n\nUse instead:\n\n```python\nclass GenericClass[T]:\n    var: T\n\n\ndef generic_function[T](var: T) -> list[T]:\n    return var[0]\n```\n\n## Fix availability\n\nIf the name without an underscore would shadow a builtin or another variable, would be a\nkeyword, or would otherwise be an invalid identifier, a fix will not be available. In these\nsituations, you can consider using a trailing underscore or a different name entirely to satisfy\nthe lint rule.\n\n## See also\n\nThis rule renames private [PEP 695] type parameters but doesn't convert pre-[PEP 695] generics\nto the new format. See [`non-pep695-generic-function`][UP047] and\n[`non-pep695-generic-class`][UP046] for rules that will make this transformation.\nThose rules do not remove unused type variables after their changes,\nso you may also want to consider enabling [`unused-private-type-var`][PYI018] to complete\nthe transition to [PEP 695] generics.\n\n[PEP 695]: https://peps.python.org/pep-0695/\n[UP047]: https://docs.astral.sh/ruff/rules/non-pep695-generic-function\n[UP046]: https://docs.astral.sh/ruff/rules/non-pep695-generic-class\n[PYI018]: https://docs.astral.sh/ruff/rules/unused-private-type-var\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "read-whole-file",
    "code": "FURB101",
    "explanation": "## What it does\nChecks for uses of `open` and `read` that can be replaced by `pathlib`\nmethods, like `Path.read_text` and `Path.read_bytes`.\n\n## Why is this bad?\nWhen reading the entire contents of a file into a variable, it's simpler\nand more concise to use `pathlib` methods like `Path.read_text` and\n`Path.read_bytes` instead of `open` and `read` calls via `with` statements.\n\n## Example\n```python\nwith open(filename) as f:\n    contents = f.read()\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\ncontents = Path(filename).read_text()\n```\n\n## References\n- [Python documentation: `Path.read_bytes`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.read_bytes)\n- [Python documentation: `Path.read_text`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.read_text)\n",
    "preview": true
  },
  {
    "name": "write-whole-file",
    "code": "FURB103",
    "explanation": "## What it does\nChecks for uses of `open` and `write` that can be replaced by `pathlib`\nmethods, like `Path.write_text` and `Path.write_bytes`.\n\n## Why is this bad?\nWhen writing a single string to a file, it's simpler and more concise\nto use `pathlib` methods like `Path.write_text` and `Path.write_bytes`\ninstead of `open` and `write` calls via `with` statements.\n\n## Example\n```python\nwith open(filename, \"w\") as f:\n    f.write(contents)\n```\n\nUse instead:\n```python\nfrom pathlib import Path\n\nPath(filename).write_text(contents)\n```\n\n## References\n- [Python documentation: `Path.write_bytes`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.write_bytes)\n- [Python documentation: `Path.write_text`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.write_text)\n",
    "preview": true
  },
  {
    "name": "print-empty-string",
    "code": "FURB105",
    "explanation": "## What it does\nChecks for `print` calls with unnecessary empty strings as positional\narguments and unnecessary `sep` keyword arguments.\n\n## Why is this bad?\nPrefer calling `print` without any positional arguments, which is\nequivalent and more concise.\n\nSimilarly, when printing one or fewer items, the `sep` keyword argument,\n(used to define the string that separates the `print` arguments) can be\nomitted, as it's redundant when there are no items to separate.\n\n## Example\n```python\nprint(\"\")\n```\n\nUse instead:\n```python\nprint()\n```\n\n## References\n- [Python documentation: `print`](https://docs.python.org/3/library/functions.html#print)\n",
    "fix": 1
  },
  {
    "name": "if-exp-instead-of-or-operator",
    "code": "FURB110",
    "explanation": "## What it does\nChecks for ternary `if` expressions that can be replaced with the `or`\noperator.\n\n## Why is this bad?\nTernary `if` expressions are more verbose than `or` expressions while\nproviding the same functionality.\n\n## Example\n```python\nz = x if x else y\n```\n\nUse instead:\n```python\nz = x or y\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe in the event that the body of the\n`if` expression contains side effects.\n\nFor example, `foo` will be called twice in `foo() if foo() else bar()`\n(assuming `foo()` returns a truthy value), but only once in\n`foo() or bar()`.\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "repeated-append",
    "code": "FURB113",
    "explanation": "## What it does\nChecks for consecutive calls to `append`.\n\n## Why is this bad?\nConsecutive calls to `append` can be less efficient than batching them into\na single `extend`. Each `append` resizes the list individually, whereas an\n`extend` can resize the list once for all elements.\n\n## Known problems\nThis rule is prone to false negatives due to type inference limitations,\nas it will only detect lists that are instantiated as literals or annotated\nwith a type annotation.\n\n## Example\n```python\nnums = [1, 2, 3]\n\nnums.append(4)\nnums.append(5)\nnums.append(6)\n```\n\nUse instead:\n```python\nnums = [1, 2, 3]\n\nnums.extend((4, 5, 6))\n```\n\n## References\n- [Python documentation: More on Lists](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists)\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "f-string-number-format",
    "code": "FURB116",
    "explanation": "## What it does\nChecks for uses of `bin(...)[2:]` (or `hex`, or `oct`) to convert\nan integer into a string.\n\n## Why is this bad?\nWhen converting an integer to a baseless binary, hexadecimal, or octal\nstring, using f-strings is more concise and readable than using the\n`bin`, `hex`, or `oct` functions followed by a slice.\n\n## Example\n```python\nprint(bin(1337)[2:])\n```\n\nUse instead:\n```python\nprint(f\"{1337:b}\")\n```\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "reimplemented-operator",
    "code": "FURB118",
    "explanation": "## What it does\nChecks for lambda expressions and function definitions that can be replaced with a function from\nthe `operator` module.\n\n## Why is this bad?\nThe `operator` module provides functions that implement the same functionality as the\ncorresponding operators. For example, `operator.add` is often equivalent to `lambda x, y: x + y`.\nUsing the functions from the `operator` module is more concise and communicates the intent of\nthe code more clearly.\n\n## Example\n```python\nimport functools\n\nnums = [1, 2, 3]\ntotal = functools.reduce(lambda x, y: x + y, nums)\n```\n\nUse instead:\n```python\nimport functools\nimport operator\n\nnums = [1, 2, 3]\ntotal = functools.reduce(operator.add, nums)\n```\n\n## Fix safety\nThe fix offered by this rule is always marked as unsafe. While the changes the fix would make\nwould rarely break your code, there are two ways in which functions from the `operator` module\ndiffer from user-defined functions. It would be non-trivial for Ruff to detect whether or not\nthese differences would matter in a specific situation where Ruff is emitting a diagnostic for\nthis rule.\n\nThe first difference is that `operator` functions cannot be called with keyword arguments, but\nmost user-defined functions can. If an `add` function is defined as `add = lambda x, y: x + y`,\nreplacing this function with `operator.add` will cause the later call to raise `TypeError` if\nthe function is later called with keyword arguments, e.g. `add(x=1, y=2)`.\n\nThe second difference is that user-defined functions are [descriptors], but this is not true of\nthe functions defined in the `operator` module. Practically speaking, this means that defining\na function in a class body (either by using a `def` statement or assigning a `lambda` function\nto a variable) is a valid way of defining an instance method on that class; monkeypatching a\nuser-defined function onto a class after the class has been created also has the same effect.\nThe same is not true of an `operator` function: assigning an `operator` function to a variable\nin a class body or monkeypatching one onto a class will not create a valid instance method.\nRuff will refrain from emitting diagnostics for this rule on function definitions in class\nbodies; however, it does not currently have sophisticated enough type inference to avoid\nemitting this diagnostic if a user-defined function is being monkeypatched onto a class after\nthe class has been constructed.\n\n[descriptors]: https://docs.python.org/3/howto/descriptor.html\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "for-loop-writes",
    "code": "FURB122",
    "explanation": "## What it does\nChecks for the use of `IOBase.write` in a for loop.\n\n## Why is this bad?\nWhen writing a batch of elements, it's more idiomatic to use a single method call to\n`IOBase.writelines`, rather than write elements one by one.\n\n## Example\n```python\nwith Path(\"file\").open(\"w\") as f:\n    for line in lines:\n        f.write(line)\n\nwith Path(\"file\").open(\"wb\") as f:\n    for line in lines:\n        f.write(line.encode())\n```\n\nUse instead:\n```python\nwith Path(\"file\").open(\"w\") as f:\n    f.writelines(lines)\n\nwith Path(\"file\").open(\"wb\") as f:\n    f.writelines(line.encode() for line in lines)\n```\n\n## References\n- [Python documentation: `io.IOBase.writelines`](https://docs.python.org/3/library/io.html#io.IOBase.writelines)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "readlines-in-for",
    "code": "FURB129",
    "explanation": "## What it does\nChecks for uses of `readlines()` when iterating over a file line-by-line.\n\n## Why is this bad?\nRather than iterating over all lines in a file by calling `readlines()`,\nit's more convenient and performant to iterate over the file object\ndirectly.\n\n## Example\n```python\nwith open(\"file.txt\") as fp:\n    for line in fp.readlines():\n        ...\n```\n\nUse instead:\n```python\nwith open(\"file.txt\") as fp:\n    for line in fp:\n        ...\n```\n\n## References\n- [Python documentation: `io.IOBase.readlines`](https://docs.python.org/3/library/io.html#io.IOBase.readlines)\n",
    "fix": 2
  },
  {
    "name": "delete-full-slice",
    "code": "FURB131",
    "explanation": "## What it does\nChecks for `del` statements that delete the entire slice of a list or\ndictionary.\n\n## Why is this bad?\nIt is faster and more succinct to remove all items via the `clear()`\nmethod.\n\n## Known problems\nThis rule is prone to false negatives due to type inference limitations,\nas it will only detect lists and dictionaries that are instantiated as\nliterals or annotated with a type annotation.\n\n## Example\n```python\nnames = {\"key\": \"value\"}\nnums = [1, 2, 3]\n\ndel names[:]\ndel nums[:]\n```\n\nUse instead:\n```python\nnames = {\"key\": \"value\"}\nnums = [1, 2, 3]\n\nnames.clear()\nnums.clear()\n```\n\n## References\n- [Python documentation: Mutable Sequence Types](https://docs.python.org/3/library/stdtypes.html?highlight=list#mutable-sequence-types)\n- [Python documentation: `dict.clear()`](https://docs.python.org/3/library/stdtypes.html?highlight=list#dict.clear)\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "check-and-remove-from-set",
    "code": "FURB132",
    "explanation": "## What it does\nChecks for uses of `set.remove` that can be replaced with `set.discard`.\n\n## Why is this bad?\nIf an element should be removed from a set if it is present, it is more\nsuccinct and idiomatic to use `discard`.\n\n## Known problems\nThis rule is prone to false negatives due to type inference limitations,\nas it will only detect sets that are instantiated as literals or annotated\nwith a type annotation.\n\n## Example\n```python\nnums = {123, 456}\n\nif 123 in nums:\n    nums.remove(123)\n```\n\nUse instead:\n```python\nnums = {123, 456}\n\nnums.discard(123)\n```\n\n## References\n- [Python documentation: `set.discard()`](https://docs.python.org/3/library/stdtypes.html?highlight=list#frozenset.discard)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "if-expr-min-max",
    "code": "FURB136",
    "explanation": "## What it does\nChecks for `if` expressions that can be replaced with `min()` or `max()`\ncalls.\n\n## Why is this bad?\nAn `if` expression that selects the lesser or greater of two\nsub-expressions can be replaced with a `min()` or `max()` call\nrespectively. When possible, prefer `min()` and `max()`, as they're more\nconcise and readable than the equivalent `if` expression.\n\n## Example\n```python\nhighest_score = score1 if score1 > score2 else score2\n```\n\nUse instead:\n```python\nhighest_score = max(score2, score1)\n```\n\n## References\n- [Python documentation: `min`](https://docs.python.org/3.11/library/functions.html#min)\n- [Python documentation: `max`](https://docs.python.org/3.11/library/functions.html#max)\n",
    "fix": 1
  },
  {
    "name": "reimplemented-starmap",
    "code": "FURB140",
    "explanation": "## What it does\nChecks for generator expressions, list and set comprehensions that can\nbe replaced with `itertools.starmap`.\n\n## Why is this bad?\nWhen unpacking values from iterators to pass them directly to\na function, prefer `itertools.starmap`.\n\nUsing `itertools.starmap` is more concise and readable. Furthermore, it is\nmore efficient than generator expressions, and in some versions of Python,\nit is more efficient than comprehensions.\n\n## Known problems\nSince Python 3.12, `itertools.starmap` is less efficient than\ncomprehensions ([#7771]). This is due to [PEP 709], which made\ncomprehensions faster.\n\n## Example\n```python\nall(predicate(a, b) for a, b in some_iterable)\n```\n\nUse instead:\n```python\nfrom itertools import starmap\n\n\nall(starmap(predicate, some_iterable))\n```\n\n## References\n- [Python documentation: `itertools.starmap`](https://docs.python.org/3/library/itertools.html#itertools.starmap)\n\n[PEP 709]: https://peps.python.org/pep-0709/\n[#7771]: https://github.com/astral-sh/ruff/issues/7771\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "for-loop-set-mutations",
    "code": "FURB142",
    "explanation": "## What it does\nChecks for code that updates a set with the contents of an iterable by\nusing a `for` loop to call `.add()` or `.discard()` on each element\nseparately.\n\n## Why is this bad?\nWhen adding or removing a batch of elements to or from a set, it's more\nidiomatic to use a single method call rather than adding or removing\nelements one by one.\n\n## Example\n```python\ns = set()\n\nfor x in (1, 2, 3):\n    s.add(x)\n\nfor x in (1, 2, 3):\n    s.discard(x)\n```\n\nUse instead:\n```python\ns = set()\n\ns.update((1, 2, 3))\ns.difference_update((1, 2, 3))\n```\n\n## Fix safety\nThe fix will be marked as unsafe if applying the fix would delete any comments.\nOtherwise, it is marked as safe.\n\n## References\n- [Python documentation: `set`](https://docs.python.org/3/library/stdtypes.html#set)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "slice-copy",
    "code": "FURB145",
    "explanation": "## What it does\nChecks for unbounded slice expressions to copy a list.\n\n## Why is this bad?\nThe `list.copy` method is more readable and consistent with copying other\ntypes.\n\n## Known problems\nThis rule is prone to false negatives due to type inference limitations,\nas it will only detect lists that are instantiated as literals or annotated\nwith a type annotation.\n\n## Example\n```python\na = [1, 2, 3]\nb = a[:]\n```\n\nUse instead:\n```python\na = [1, 2, 3]\nb = a.copy()\n```\n\n## References\n- [Python documentation: Mutable Sequence Types](https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types)\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "unnecessary-enumerate",
    "code": "FURB148",
    "explanation": "## What it does\nChecks for uses of `enumerate` that discard either the index or the value\nwhen iterating over a sequence.\n\n## Why is this bad?\nThe built-in `enumerate` function is useful when you need both the index and\nvalue of a sequence.\n\nIf you only need the index or values of a sequence, you should iterate over\n`range(len(...))` or the sequence itself, respectively, instead. This is\nmore efficient and communicates the intent of the code more clearly.\n\n## Known problems\nThis rule is prone to false negatives due to type inference limitations;\nnamely, it will only suggest a fix using the `len` builtin function if the\nsequence passed to `enumerate` is an instantiated as a list, set, dict, or\ntuple literal, or annotated as such with a type annotation.\n\nThe `len` builtin function is not defined for all object types (such as\ngenerators), and so refactoring to use `len` over `enumerate` is not always\nsafe.\n\n## Example\n```python\nfor index, _ in enumerate(sequence):\n    print(index)\n\nfor _, value in enumerate(sequence):\n    print(value)\n```\n\nUse instead:\n```python\nfor index in range(len(sequence)):\n    print(index)\n\nfor value in sequence:\n    print(value)\n```\n\n## References\n- [Python documentation: `enumerate`](https://docs.python.org/3/library/functions.html#enumerate)\n- [Python documentation: `range`](https://docs.python.org/3/library/stdtypes.html#range)\n- [Python documentation: `len`](https://docs.python.org/3/library/functions.html#len)\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "math-constant",
    "code": "FURB152",
    "explanation": "## What it does\nChecks for literals that are similar to constants in `math` module.\n\n## Why is this bad?\nHard-coding mathematical constants like \u03c0 increases code duplication,\nreduces readability, and may lead to a lack of precision.\n\n## Example\n```python\nA = 3.141592 * r**2\n```\n\nUse instead:\n```python\nA = math.pi * r**2\n```\n\n## References\n- [Python documentation: `math` constants](https://docs.python.org/3/library/math.html#constants)\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "repeated-global",
    "code": "FURB154",
    "explanation": "## What it does\nChecks for consecutive `global` (or `nonlocal`) statements.\n\n## Why is this bad?\nThe `global` and `nonlocal` keywords accepts multiple comma-separated names.\nInstead of using multiple `global` (or `nonlocal`) statements for separate\nvariables, you can use a single statement to declare multiple variables at\nonce.\n\n## Example\n```python\ndef func():\n    global x\n    global y\n\n    print(x, y)\n```\n\nUse instead:\n```python\ndef func():\n    global x, y\n\n    print(x, y)\n```\n\n## References\n- [Python documentation: the `global` statement](https://docs.python.org/3/reference/simple_stmts.html#the-global-statement)\n- [Python documentation: the `nonlocal` statement](https://docs.python.org/3/reference/simple_stmts.html#the-nonlocal-statement)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "hardcoded-string-charset",
    "code": "FURB156",
    "explanation": "## What it does\nChecks for uses of hardcoded charsets, which are defined in Python string module.\n\n## Why is this bad?\nUsage of named charsets from the standard library is more readable and less error-prone.\n\n## Example\n```python\nx = \"0123456789\"\ny in \"abcdefghijklmnopqrstuvwxyz\"\n```\n\nUse instead\n```python\nimport string\n\nx = string.digits\ny in string.ascii_lowercase\n```\n\n## References\n- [Python documentation: String constants](https://docs.python.org/3/library/string.html#string-constants)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "verbose-decimal-constructor",
    "code": "FURB157",
    "explanation": "## What it does\nChecks for unnecessary string literal or float casts in `Decimal`\nconstructors.\n\n## Why is this bad?\nThe `Decimal` constructor accepts a variety of arguments, including\nintegers, floats, and strings. However, it's not necessary to cast\ninteger literals to strings when passing them to the `Decimal`.\n\nSimilarly, `Decimal` accepts `inf`, `-inf`, and `nan` as string literals,\nso there's no need to wrap those values in a `float` call when passing\nthem to the `Decimal` constructor.\n\nPrefer the more concise form of argument passing for `Decimal`\nconstructors, as it's more readable and idiomatic.\n\n## Example\n```python\nDecimal(\"0\")\nDecimal(float(\"Infinity\"))\n```\n\nUse instead:\n```python\nDecimal(0)\nDecimal(\"Infinity\")\n```\n\n## References\n- [Python documentation: `decimal`](https://docs.python.org/3/library/decimal.html)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "bit-count",
    "code": "FURB161",
    "explanation": "## What it does\nChecks for uses of `bin(...).count(\"1\")` to perform a population count.\n\n## Why is this bad?\nIn Python 3.10, a `bit_count()` method was added to the `int` class,\nwhich is more concise and efficient than converting to a binary\nrepresentation via `bin(...)`.\n\n## Example\n```python\nx = bin(123).count(\"1\")\ny = bin(0b1111011).count(\"1\")\n```\n\nUse instead:\n```python\nx = (123).bit_count()\ny = 0b1111011.bit_count()\n```\n\n## Options\n- `target-version`\n\n## References\n- [Python documentation:`int.bit_count`](https://docs.python.org/3/library/stdtypes.html#int.bit_count)\n",
    "fix": 2
  },
  {
    "name": "fromisoformat-replace-z",
    "code": "FURB162",
    "explanation": "## What it does\nChecks for `datetime.fromisoformat()` calls\nwhere the only argument is an inline replacement\nof `Z` with a zero offset timezone.\n\n## Why is this bad?\nOn Python 3.11 and later, `datetime.fromisoformat()` can handle most [ISO 8601][iso-8601]\nformats including ones affixed with `Z`, so such an operation is unnecessary.\n\nMore information on unsupported formats\ncan be found in [the official documentation][fromisoformat].\n\n## Example\n\n```python\nfrom datetime import datetime\n\n\ndate = \"2025-01-01T00:00:00Z\"\n\ndatetime.fromisoformat(date.replace(\"Z\", \"+00:00\"))\ndatetime.fromisoformat(date[:-1] + \"-00\")\ndatetime.fromisoformat(date.strip(\"Z\", \"-0000\"))\ndatetime.fromisoformat(date.rstrip(\"Z\", \"-00:00\"))\n```\n\nUse instead:\n\n```python\nfrom datetime import datetime\n\n\ndate = \"2025-01-01T00:00:00Z\"\n\ndatetime.fromisoformat(date)\n```\n\n## Fix safety\nThe fix is always marked as unsafe,\nas it might change the program's behaviour.\n\nFor example, working code might become non-working:\n\n```python\nd = \"Z2025-01-01T00:00:00Z\"  # Note the leading `Z`\n\ndatetime.fromisoformat(d.strip(\"Z\") + \"+00:00\")  # Fine\ndatetime.fromisoformat(d)  # Runtime error\n```\n\n## References\n* [What\u2019s New In Python 3.11 &sect; `datetime`](https://docs.python.org/3/whatsnew/3.11.html#datetime)\n* [`fromisoformat`](https://docs.python.org/3/library/datetime.html#datetime.date.fromisoformat)\n\n[iso-8601]: https://www.iso.org/obp/ui/#iso:std:iso:8601\n[fromisoformat]: https://docs.python.org/3/library/datetime.html#datetime.date.fromisoformat\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "redundant-log-base",
    "code": "FURB163",
    "explanation": "## What it does\nChecks for `math.log` calls with a redundant base.\n\n## Why is this bad?\nThe default base of `math.log` is `e`, so specifying it explicitly is\nredundant.\n\nInstead of passing 2 or 10 as the base, use `math.log2` or `math.log10`\nrespectively, as these dedicated variants are typically more accurate\nthan `math.log`.\n\n## Example\n```python\nimport math\n\nmath.log(4, math.e)\nmath.log(4, 2)\nmath.log(4, 10)\n```\n\nUse instead:\n```python\nimport math\n\nmath.log(4)\nmath.log2(4)\nmath.log10(4)\n```\n\n## References\n- [Python documentation: `math.log`](https://docs.python.org/3/library/math.html#math.log)\n- [Python documentation: `math.log2`](https://docs.python.org/3/library/math.html#math.log2)\n- [Python documentation: `math.log10`](https://docs.python.org/3/library/math.html#math.log10)\n- [Python documentation: `math.e`](https://docs.python.org/3/library/math.html#math.e)\n",
    "fix": 1
  },
  {
    "name": "unnecessary-from-float",
    "code": "FURB164",
    "explanation": "## What it does\nChecks for unnecessary `from_float` and `from_decimal` usages to construct\n`Decimal` and `Fraction` instances.\n\n## Why is this bad?\nSince Python 3.2, the `Fraction` and `Decimal` classes can be constructed\nby passing float or decimal instances to the constructor directly. As such,\nthe use of `from_float` and `from_decimal` methods is unnecessary, and\nshould be avoided in favor of the more concise constructor syntax.\n\n## Example\n```python\nDecimal.from_float(4.2)\nDecimal.from_float(float(\"inf\"))\nFraction.from_float(4.2)\nFraction.from_decimal(Decimal(\"4.2\"))\n```\n\nUse instead:\n```python\nDecimal(4.2)\nDecimal(\"inf\")\nFraction(4.2)\nFraction(Decimal(4.2))\n```\n\n## References\n- [Python documentation: `decimal`](https://docs.python.org/3/library/decimal.html)\n- [Python documentation: `fractions`](https://docs.python.org/3/library/fractions.html)\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "int-on-sliced-str",
    "code": "FURB166",
    "explanation": "## What it does\nChecks for uses of `int` with an explicit base in which a string expression\nis stripped of its leading prefix (i.e., `0b`, `0o`, or `0x`).\n\n## Why is this bad?\nGiven an integer string with a prefix (e.g., `0xABC`), Python can automatically\ndetermine the base of the integer by the prefix without needing to specify\nit explicitly.\n\nInstead of `int(num[2:], 16)`, use `int(num, 0)`, which will automatically\ndeduce the base based on the prefix.\n\n## Example\n```python\nnum = \"0xABC\"\n\nif num.startswith(\"0b\"):\n    i = int(num[2:], 2)\nelif num.startswith(\"0o\"):\n    i = int(num[2:], 8)\nelif num.startswith(\"0x\"):\n    i = int(num[2:], 16)\n\nprint(i)\n```\n\nUse instead:\n```python\nnum = \"0xABC\"\n\ni = int(num, 0)\n\nprint(i)\n```\n\n## Fix safety\nThe rule's fix is marked as unsafe, as Ruff cannot guarantee that the\nargument to `int` will remain valid when its base is included in the\nfunction call.\n\n## References\n- [Python documentation: `int`](https://docs.python.org/3/library/functions.html#int)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "regex-flag-alias",
    "code": "FURB167",
    "explanation": "## What it does\nChecks for the use of shorthand aliases for regular expression flags\n(e.g., `re.I` instead of `re.IGNORECASE`).\n\n## Why is this bad?\nThe regular expression module provides descriptive names for each flag,\nalong with single-letter aliases. Prefer the descriptive names, as they\nare more readable and self-documenting.\n\n## Example\n```python\nimport re\n\nif re.match(\"^hello\", \"hello world\", re.I):\n    ...\n```\n\nUse instead:\n```python\nimport re\n\nif re.match(\"^hello\", \"hello world\", re.IGNORECASE):\n    ...\n```\n\n",
    "fix": 2
  },
  {
    "name": "isinstance-type-none",
    "code": "FURB168",
    "explanation": "## What it does\nChecks for uses of `isinstance` that check if an object is of type `None`.\n\n## Why is this bad?\nThere is only ever one instance of `None`, so it is more efficient and\nreadable to use the `is` operator to check if an object is `None`.\n\n## Example\n```python\nisinstance(obj, type(None))\n```\n\nUse instead:\n```python\nobj is None\n```\n\n## Fix safety\nThe fix will be marked as unsafe if there are any comments within the call.\n\n## References\n- [Python documentation: `isinstance`](https://docs.python.org/3/library/functions.html#isinstance)\n- [Python documentation: `None`](https://docs.python.org/3/library/constants.html#None)\n- [Python documentation: `type`](https://docs.python.org/3/library/functions.html#type)\n- [Python documentation: Identity comparisons](https://docs.python.org/3/reference/expressions.html#is-not)\n",
    "fix": 1
  },
  {
    "name": "type-none-comparison",
    "code": "FURB169",
    "explanation": "## What it does\nChecks for uses of `type` that compare the type of an object to the type of `None`.\n\n## Why is this bad?\nThere is only ever one instance of `None`, so it is more efficient and\nreadable to use the `is` operator to check if an object is `None`.\n\n## Example\n```python\ntype(obj) is type(None)\n```\n\nUse instead:\n```python\nobj is None\n```\n\n## Fix safety\nIf the fix might remove comments, it will be marked as unsafe.\n\n## References\n- [Python documentation: `isinstance`](https://docs.python.org/3/library/functions.html#isinstance)\n- [Python documentation: `None`](https://docs.python.org/3/library/constants.html#None)\n- [Python documentation: `type`](https://docs.python.org/3/library/functions.html#type)\n- [Python documentation: Identity comparisons](https://docs.python.org/3/reference/expressions.html#is-not)\n",
    "fix": 2
  },
  {
    "name": "single-item-membership-test",
    "code": "FURB171",
    "explanation": "## What it does\nChecks for membership tests against single-item containers.\n\n## Why is this bad?\nPerforming a membership test against a container (like a `list` or `set`)\nwith a single item is less readable and less efficient than comparing\nagainst the item directly.\n\n## Example\n```python\n1 in [1]\n```\n\nUse instead:\n```python\n1 == 1\n```\n\n## Fix safety\n\nWhen the right-hand side is a string, the fix is marked as unsafe.\nThis is because `c in \"a\"` is true both when `c` is `\"a\"` and when `c` is the empty string,\nso the fix can change the behavior of your program in these cases.\n\nAdditionally, if there are comments within the fix's range,\nit will also be marked as unsafe.\n\n## References\n- [Python documentation: Comparisons](https://docs.python.org/3/reference/expressions.html#comparisons)\n- [Python documentation: Membership test operations](https://docs.python.org/3/reference/expressions.html#membership-test-operations)\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "implicit-cwd",
    "code": "FURB177",
    "explanation": "## What it does\nChecks for current-directory lookups using `Path().resolve()`.\n\n## Why is this bad?\nWhen looking up the current directory, prefer `Path.cwd()` over\n`Path().resolve()`, as `Path.cwd()` is more explicit in its intent.\n\n## Example\n```python\ncwd = Path().resolve()\n```\n\nUse instead:\n```python\ncwd = Path.cwd()\n```\n\n## References\n- [Python documentation: `Path.cwd`](https://docs.python.org/3/library/pathlib.html#pathlib.Path.cwd)\n",
    "fix": 1
  },
  {
    "name": "meta-class-abc-meta",
    "code": "FURB180",
    "explanation": "## What it does\nChecks for uses of `metaclass=abc.ABCMeta` to define abstract base classes\n(ABCs).\n\n## Why is this bad?\n\nInstead of `class C(metaclass=abc.ABCMeta): ...`, use `class C(ABC): ...`\nto define an abstract base class. Inheriting from the `ABC` wrapper class\nis semantically identical to setting `metaclass=abc.ABCMeta`, but more\nsuccinct.\n\n## Example\n```python\nclass C(metaclass=ABCMeta):\n    pass\n```\n\nUse instead:\n```python\nclass C(ABC):\n    pass\n```\n\n## References\n- [Python documentation: `abc.ABC`](https://docs.python.org/3/library/abc.html#abc.ABC)\n- [Python documentation: `abc.ABCMeta`](https://docs.python.org/3/library/abc.html#abc.ABCMeta)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "hashlib-digest-hex",
    "code": "FURB181",
    "explanation": "## What it does\nChecks for the use of `.digest().hex()` on a hashlib hash, like `sha512`.\n\n## Why is this bad?\nWhen generating a hex digest from a hash, it's preferable to use the\n`.hexdigest()` method, rather than calling `.digest()` and then `.hex()`,\nas the former is more concise and readable.\n\n## Example\n```python\nfrom hashlib import sha512\n\nhashed = sha512(b\"some data\").digest().hex()\n```\n\nUse instead:\n```python\nfrom hashlib import sha512\n\nhashed = sha512(b\"some data\").hexdigest()\n```\n\n## References\n- [Python documentation: `hashlib`](https://docs.python.org/3/library/hashlib.html)\n",
    "fix": 1
  },
  {
    "name": "list-reverse-copy",
    "code": "FURB187",
    "explanation": "## What it does\nChecks for list reversals that can be performed in-place in lieu of\ncreating a new list.\n\n## Why is this bad?\nWhen reversing a list, it's more efficient to use the in-place method\n`.reverse()` instead of creating a new list, if the original list is\nno longer needed.\n\n## Example\n```python\nl = [1, 2, 3]\nl = reversed(l)\n\nl = [1, 2, 3]\nl = list(reversed(l))\n\nl = [1, 2, 3]\nl = l[::-1]\n```\n\nUse instead:\n```python\nl = [1, 2, 3]\nl.reverse()\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as calling `.reverse()` on a list\nwill mutate the list in-place, unlike `reversed`, which creates a new list\nand leaves the original list unchanged.\n\nIf the list is referenced elsewhere, this could lead to unexpected\nbehavior.\n\n## References\n- [Python documentation: More on Lists](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists)\n",
    "fix": 2
  },
  {
    "name": "slice-to-remove-prefix-or-suffix",
    "code": "FURB188",
    "explanation": "## What it does\nChecks for code that could be written more idiomatically using\n[`str.removeprefix()`](https://docs.python.org/3/library/stdtypes.html#str.removeprefix)\nor [`str.removesuffix()`](https://docs.python.org/3/library/stdtypes.html#str.removesuffix).\n\nSpecifically, the rule flags code that conditionally removes a prefix or suffix\nusing a slice operation following an `if` test that uses `str.startswith()` or `str.endswith()`.\n\nThe rule is only applied if your project targets Python 3.9 or later.\n\n## Why is this bad?\nThe methods [`str.removeprefix()`](https://docs.python.org/3/library/stdtypes.html#str.removeprefix)\nand [`str.removesuffix()`](https://docs.python.org/3/library/stdtypes.html#str.removesuffix),\nintroduced in Python 3.9, have the same behavior while being more readable and efficient.\n\n## Example\n```python\ndef example(filename: str, text: str):\n    filename = filename[:-4] if filename.endswith(\".txt\") else filename\n\n    if text.startswith(\"pre\"):\n        text = text[3:]\n```\n\nUse instead:\n```python\ndef example(filename: str, text: str):\n    filename = filename.removesuffix(\".txt\")\n    text = text.removeprefix(\"pre\")\n```\n",
    "fix": 2
  },
  {
    "name": "subclass-builtin",
    "code": "FURB189",
    "explanation": "## What it does\nChecks for subclasses of `dict`, `list` or `str`.\n\n## Why is this bad?\nSubclassing `dict`, `list`, or `str` objects can be error prone, use the\n`UserDict`, `UserList`, and `UserString` objects from the `collections` module\ninstead.\n\n## Example\n```python\nclass CaseInsensitiveDict(dict): ...\n```\n\nUse instead:\n```python\nfrom collections import UserDict\n\n\nclass CaseInsensitiveDict(UserDict): ...\n```\n\n## Fix safety\nThis fix is marked as unsafe because `isinstance()` checks for `dict`,\n`list`, and `str` types will fail when using the corresponding User class.\nIf you need to pass custom `dict` or `list` objects to code you don't\ncontrol, ignore this check. If you do control the code, consider using\nthe following type checks instead:\n\n* `dict` -> `collections.abc.MutableMapping`\n* `list` -> `collections.abc.MutableSequence`\n* `str` -> No such conversion exists\n\n## References\n\n- [Python documentation: `collections`](https://docs.python.org/3/library/collections.html)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "sorted-min-max",
    "code": "FURB192",
    "explanation": "## What it does\nChecks for uses of `sorted()` to retrieve the minimum or maximum value in\na sequence.\n\n## Why is this bad?\nUsing `sorted()` to compute the minimum or maximum value in a sequence is\ninefficient and less readable than using `min()` or `max()` directly.\n\n## Example\n```python\nnums = [3, 1, 4, 1, 5]\nlowest = sorted(nums)[0]\nhighest = sorted(nums)[-1]\nhighest = sorted(nums, reverse=True)[0]\n```\n\nUse instead:\n```python\nnums = [3, 1, 4, 1, 5]\nlowest = min(nums)\nhighest = max(nums)\n```\n\n## Fix safety\nIn some cases, migrating to `min` or `max` can lead to a change in behavior,\nnotably when breaking ties.\n\nAs an example, `sorted(data, key=itemgetter(0), reverse=True)[0]` will return\nthe _last_ \"minimum\" element in the list, if there are multiple elements with\nthe same key. However, `min(data, key=itemgetter(0))` will return the _first_\n\"minimum\" element in the list in the same scenario.\n\nAs such, this rule's fix is marked as unsafe when the `reverse` keyword is used.\n\n## References\n- [Python documentation: `min`](https://docs.python.org/3/library/functions.html#min)\n- [Python documentation: `max`](https://docs.python.org/3/library/functions.html#max)\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "ambiguous-unicode-character-string",
    "code": "RUF001",
    "explanation": "## What it does\nChecks for ambiguous Unicode characters in strings.\n\n## Why is this bad?\nSome Unicode characters are visually similar to ASCII characters, but have\ndifferent code points. For example, `GREEK CAPITAL LETTER ALPHA` (`U+0391`)\nis visually similar, but not identical, to the ASCII character `A`.\n\nThe use of ambiguous Unicode characters can confuse readers, cause subtle\nbugs, and even make malicious code look harmless.\n\nIn [preview], this rule will also flag Unicode characters that are\nconfusable with other, non-preferred Unicode characters. For example, the\nspec recommends `GREEK CAPITAL LETTER OMEGA` over `OHM SIGN`.\n\nYou can omit characters from being flagged as ambiguous via the\n[`lint.allowed-confusables`] setting.\n\n## Example\n```python\nprint(\"\u0397ello, world!\")  # \"\u0397\" is the Greek eta (`U+0397`).\n```\n\nUse instead:\n```python\nprint(\"Hello, world!\")  # \"H\" is the Latin capital H (`U+0048`).\n```\n\n## Options\n- `lint.allowed-confusables`\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "ambiguous-unicode-character-docstring",
    "code": "RUF002",
    "explanation": "## What it does\nChecks for ambiguous Unicode characters in docstrings.\n\n## Why is this bad?\nSome Unicode characters are visually similar to ASCII characters, but have\ndifferent code points. For example, `GREEK CAPITAL LETTER ALPHA` (`U+0391`)\nis visually similar, but not identical, to the ASCII character `A`.\n\nThe use of ambiguous Unicode characters can confuse readers, cause subtle\nbugs, and even make malicious code look harmless.\n\nIn [preview], this rule will also flag Unicode characters that are\nconfusable with other, non-preferred Unicode characters. For example, the\nspec recommends `GREEK CAPITAL LETTER OMEGA` over `OHM SIGN`.\n\nYou can omit characters from being flagged as ambiguous via the\n[`lint.allowed-confusables`] setting.\n\n## Example\n```python\n\"\"\"A lovely docstring (with a `U+FF09` parenthesis\uff09.\"\"\"\n```\n\nUse instead:\n```python\n\"\"\"A lovely docstring (with no strange parentheses).\"\"\"\n```\n\n## Options\n- `lint.allowed-confusables`\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "ambiguous-unicode-character-comment",
    "code": "RUF003",
    "explanation": "## What it does\nChecks for ambiguous Unicode characters in comments.\n\n## Why is this bad?\nSome Unicode characters are visually similar to ASCII characters, but have\ndifferent code points. For example, `GREEK CAPITAL LETTER ALPHA` (`U+0391`)\nis visually similar, but not identical, to the ASCII character `A`.\n\nThe use of ambiguous Unicode characters can confuse readers, cause subtle\nbugs, and even make malicious code look harmless.\n\nIn [preview], this rule will also flag Unicode characters that are\nconfusable with other, non-preferred Unicode characters. For example, the\nspec recommends `GREEK CAPITAL LETTER OMEGA` over `OHM SIGN`.\n\nYou can omit characters from being flagged as ambiguous via the\n[`lint.allowed-confusables`] setting.\n\n## Example\n```python\nfoo()  # n\u043eqa  # \"\u043e\" is Cyrillic (`U+043E`)\n```\n\nUse instead:\n```python\nfoo()  # noqa  # \"o\" is Latin (`U+006F`)\n```\n\n## Options\n- `lint.allowed-confusables`\n\n[preview]: https://docs.astral.sh/ruff/preview/\n"
  },
  {
    "name": "collection-literal-concatenation",
    "code": "RUF005",
    "explanation": "## What it does\nChecks for uses of the `+` operator to concatenate collections.\n\n## Why is this bad?\nIn Python, the `+` operator can be used to concatenate collections (e.g.,\n`x + y` to concatenate the lists `x` and `y`).\n\nHowever, collections can be concatenated more efficiently using the\nunpacking operator (e.g., `[*x, *y]` to concatenate `x` and `y`).\n\nPrefer the unpacking operator to concatenate collections, as it is more\nreadable and flexible. The `*` operator can unpack any iterable, whereas\n `+` operates only on particular sequences which, in many cases, must be of\nthe same type.\n\n## Example\n```python\nfoo = [2, 3, 4]\nbar = [1] + foo + [5, 6]\n```\n\nUse instead:\n```python\nfoo = [2, 3, 4]\nbar = [1, *foo, 5, 6]\n```\n\n## References\n- [PEP 448 \u2013 Additional Unpacking Generalizations](https://peps.python.org/pep-0448/)\n- [Python documentation: Sequence Types \u2014 `list`, `tuple`, `range`](https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range)\n",
    "fix": 1
  },
  {
    "name": "asyncio-dangling-task",
    "code": "RUF006",
    "explanation": "## What it does\nChecks for `asyncio.create_task` and `asyncio.ensure_future` calls\nthat do not store a reference to the returned result.\n\n## Why is this bad?\nPer the `asyncio` documentation, the event loop only retains a weak\nreference to tasks. If the task returned by `asyncio.create_task` and\n`asyncio.ensure_future` is not stored in a variable, or a collection,\nor otherwise referenced, it may be garbage collected at any time. This\ncan lead to unexpected and inconsistent behavior, as your tasks may or\nmay not run to completion.\n\n## Example\n```python\nimport asyncio\n\nfor i in range(10):\n    # This creates a weak reference to the task, which may be garbage\n    # collected at any time.\n    asyncio.create_task(some_coro(param=i))\n```\n\nUse instead:\n```python\nimport asyncio\n\nbackground_tasks = set()\n\nfor i in range(10):\n    task = asyncio.create_task(some_coro(param=i))\n\n    # Add task to the set. This creates a strong reference.\n    background_tasks.add(task)\n\n    # To prevent keeping references to finished tasks forever,\n    # make each task remove its own reference from the set after\n    # completion:\n    task.add_done_callback(background_tasks.discard)\n```\n\n## References\n- [_The Heisenbug lurking in your async code_](https://textual.textualize.io/blog/2023/02/11/the-heisenbug-lurking-in-your-async-code/)\n- [The Python Standard Library](https://docs.python.org/3/library/asyncio-task.html#asyncio.create_task)\n"
  },
  {
    "name": "zip-instead-of-pairwise",
    "code": "RUF007",
    "explanation": "## What it does\nChecks for use of `zip()` to iterate over successive pairs of elements.\n\n## Why is this bad?\nWhen iterating over successive pairs of elements, prefer\n`itertools.pairwise()` over `zip()`.\n\n`itertools.pairwise()` is more readable and conveys the intent of the code\nmore clearly.\n\n## Example\n```python\nletters = \"ABCD\"\nzip(letters, letters[1:])  # (\"A\", \"B\"), (\"B\", \"C\"), (\"C\", \"D\")\n```\n\nUse instead:\n```python\nfrom itertools import pairwise\n\nletters = \"ABCD\"\npairwise(letters)  # (\"A\", \"B\"), (\"B\", \"C\"), (\"C\", \"D\")\n```\n\n## References\n- [Python documentation: `itertools.pairwise`](https://docs.python.org/3/library/itertools.html#itertools.pairwise)\n",
    "fix": 1
  },
  {
    "name": "mutable-dataclass-default",
    "code": "RUF008",
    "explanation": "## What it does\nChecks for mutable default values in dataclass attributes.\n\n## Why is this bad?\nMutable default values share state across all instances of the dataclass.\nThis can lead to bugs when the attributes are changed in one instance, as\nthose changes will unexpectedly affect all other instances.\n\nInstead of sharing mutable defaults, use the `field(default_factory=...)`\npattern.\n\nIf the default value is intended to be mutable, it must be annotated with\n`typing.ClassVar`; otherwise, a `ValueError` will be raised.\n\n## Example\n```python\nfrom dataclasses import dataclass\n\n\n@dataclass\nclass A:\n    # A list without a `default_factory` or `ClassVar` annotation\n    # will raise a `ValueError`.\n    mutable_default: list[int] = []\n```\n\nUse instead:\n```python\nfrom dataclasses import dataclass, field\n\n\n@dataclass\nclass A:\n    mutable_default: list[int] = field(default_factory=list)\n```\n\nOr:\n```python\nfrom dataclasses import dataclass\nfrom typing import ClassVar\n\n\n@dataclass\nclass A:\n    mutable_default: ClassVar[list[int]] = []\n```\n"
  },
  {
    "name": "function-call-in-dataclass-default-argument",
    "code": "RUF009",
    "explanation": "## What it does\nChecks for function calls in dataclass attribute defaults.\n\n## Why is this bad?\nFunction calls are only performed once, at definition time. The returned\nvalue is then reused by all instances of the dataclass. This can lead to\nunexpected behavior when the function call returns a mutable object, as\nchanges to the object will be shared across all instances.\n\nIf a field needs to be initialized with a mutable object, use the\n`field(default_factory=...)` pattern.\n\nAttributes whose default arguments are `NewType` calls\nwhere the original type is immutable are ignored.\n\n## Example\n```python\nfrom dataclasses import dataclass\n\n\ndef simple_list() -> list[int]:\n    return [1, 2, 3, 4]\n\n\n@dataclass\nclass A:\n    mutable_default: list[int] = simple_list()\n```\n\nUse instead:\n```python\nfrom dataclasses import dataclass, field\n\n\ndef creating_list() -> list[int]:\n    return [1, 2, 3, 4]\n\n\n@dataclass\nclass A:\n    mutable_default: list[int] = field(default_factory=creating_list)\n```\n\n## Options\n- `lint.flake8-bugbear.extend-immutable-calls`\n"
  },
  {
    "name": "explicit-f-string-type-conversion",
    "code": "RUF010",
    "explanation": "## What it does\nChecks for uses of `str()`, `repr()`, and `ascii()` as explicit type\nconversions within f-strings.\n\n## Why is this bad?\nf-strings support dedicated conversion flags for these types, which are\nmore succinct and idiomatic.\n\nNote that, in many cases, calling `str()` within an f-string is\nunnecessary and can be removed entirely, as the value will be converted\nto a string automatically, the notable exception being for classes that\nimplement a custom `__format__` method.\n\n## Example\n```python\na = \"some string\"\nf\"{repr(a)}\"\n```\n\nUse instead:\n```python\na = \"some string\"\nf\"{a!r}\"\n```\n",
    "fix": 2
  },
  {
    "name": "ruff-static-key-dict-comprehension",
    "code": "RUF011",
    "explanation": "## Removed\nThis rule was implemented in `flake8-bugbear` and has been remapped to [B035]\n\n## What it does\nChecks for dictionary comprehensions that use a static key, like a string\nliteral or a variable defined outside the comprehension.\n\n## Why is this bad?\nUsing a static key (like a string literal) in a dictionary comprehension\nis usually a mistake, as it will result in a dictionary with only one key,\ndespite the comprehension iterating over multiple values.\n\n## Example\n```python\ndata = [\"some\", \"Data\"]\n{\"key\": value.upper() for value in data}\n```\n\nUse instead:\n```python\ndata = [\"some\", \"Data\"]\n{value: value.upper() for value in data}\n```\n\n[B035]: https://docs.astral.sh/ruff/rules/static-key-dict-comprehension/\n"
  },
  {
    "name": "mutable-class-default",
    "code": "RUF012",
    "explanation": "## What it does\nChecks for mutable default values in class attributes.\n\n## Why is this bad?\nMutable default values share state across all instances of the class,\nwhile not being obvious. This can lead to bugs when the attributes are\nchanged in one instance, as those changes will unexpectedly affect all\nother instances.\n\nGenerally speaking, you probably want to avoid having mutable default\nvalues in the class body at all; instead, these variables should usually\nbe initialized in `__init__`. However, other possible fixes for the issue\ncan include:\n- Explicitly annotating the variable with [`typing.ClassVar`][ClassVar] to\n  indicate that it is intended to be shared across all instances.\n- Using an immutable data type (e.g. a tuple instead of a list)\n  for the default value.\n\n## Example\n\n```python\nclass A:\n    variable_1: list[int] = []\n    variable_2: set[int] = set()\n    variable_3: dict[str, int] = {}\n```\n\nUse instead:\n\n```python\nclass A:\n    def __init__(self) -> None:\n        self.variable_1: list[int] = []\n        self.variable_2: set[int] = set()\n        self.variable_3: dict[str, int] = {}\n```\n\nOr:\n\n```python\nfrom typing import ClassVar\n\n\nclass A:\n    variable_1: ClassVar[list[int]] = []\n    variable_2: ClassVar[set[int]] = set()\n    variable_3: ClassVar[dict[str, int]] = {}\n```\n\nOr:\n\n```python\nclass A:\n    variable_1: list[int] | None = None\n    variable_2: set[int] | None = None\n    variable_3: dict[str, int] | None = None\n```\n\nOr:\n\n```python\nfrom collections.abc import Sequence, Mapping, Set as AbstractSet\nfrom types import MappingProxyType\n\n\nclass A:\n    variable_1: Sequence[int] = ()\n    variable_2: AbstractSet[int] = frozenset()\n    variable_3: Mapping[str, int] = MappingProxyType({})\n```\n\n[ClassVar]: https://docs.python.org/3/library/typing.html#typing.ClassVar\n"
  },
  {
    "name": "implicit-optional",
    "code": "RUF013",
    "explanation": "## What it does\nChecks for the use of implicit `Optional` in type annotations when the\ndefault parameter value is `None`.\n\n## Why is this bad?\nImplicit `Optional` is prohibited by [PEP 484]. It is confusing and\ninconsistent with the rest of the type system.\n\nIt's recommended to use `Optional[T]` instead. For Python 3.10 and later,\nyou can also use `T | None`.\n\n## Example\n```python\ndef foo(arg: int = None):\n    pass\n```\n\nUse instead:\n```python\nfrom typing import Optional\n\n\ndef foo(arg: Optional[int] = None):\n    pass\n```\n\nOr, for Python 3.10 and later:\n```python\ndef foo(arg: int | None = None):\n    pass\n```\n\nIf you want to use the `|` operator in Python 3.9 and earlier, you can\nuse future imports:\n```python\nfrom __future__ import annotations\n\n\ndef foo(arg: int | None = None):\n    pass\n```\n\n## Limitations\n\nType aliases are not supported and could result in false negatives.\nFor example, the following code will not be flagged:\n```python\nText = str | bytes\n\n\ndef foo(arg: Text = None):\n    pass\n```\n\n## Options\n- `target-version`\n\n[PEP 484]: https://peps.python.org/pep-0484/#union-types\n",
    "fix": 1
  },
  {
    "name": "unnecessary-iterable-allocation-for-first-element",
    "code": "RUF015",
    "explanation": "## What it does\nChecks the following constructs, all of which can be replaced by\n`next(iter(...))`:\n\n- `list(...)[0]`\n- `tuple(...)[0]`\n- `list(i for i in ...)[0]`\n- `[i for i in ...][0]`\n- `list(...).pop(0)`\n\n## Why is this bad?\nCalling e.g. `list(...)` will create a new list of the entire collection,\nwhich can be very expensive for large collections. If you only need the\nfirst element of the collection, you can use `next(...)` or\n`next(iter(...)` to lazily fetch the first element. The same is true for\nthe other constructs.\n\n## Example\n```python\nhead = list(x)[0]\nhead = [x * x for x in range(10)][0]\n```\n\nUse instead:\n```python\nhead = next(iter(x))\nhead = next(x * x for x in range(10))\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as migrating from (e.g.) `list(...)[0]`\nto `next(iter(...))` can change the behavior of your program in two ways:\n\n1. First, all above-mentioned constructs will eagerly evaluate the entire\n   collection, while `next(iter(...))` will only evaluate the first\n   element. As such, any side effects that occur during iteration will be\n   delayed.\n2. Second, accessing members of a collection via square bracket notation\n   `[0]` of the `pop()` function will raise `IndexError` if the collection\n   is empty, while `next(iter(...))` will raise `StopIteration`.\n\n## References\n- [Iterators and Iterables in Python: Run Efficient Iterations](https://realpython.com/python-iterators-iterables/#when-to-use-an-iterator-in-python)\n",
    "fix": 2
  },
  {
    "name": "invalid-index-type",
    "code": "RUF016",
    "explanation": "## What it does\nChecks for indexed access to lists, strings, tuples, bytes, and comprehensions\nusing a type other than an integer or slice.\n\n## Why is this bad?\nOnly integers or slices can be used as indices to these types. Using\nother types will result in a `TypeError` at runtime and a `SyntaxWarning` at\nimport time.\n\n## Example\n```python\nvar = [1, 2, 3][\"x\"]\n```\n\nUse instead:\n```python\nvar = [1, 2, 3][0]\n```\n"
  },
  {
    "name": "quadratic-list-summation",
    "code": "RUF017",
    "explanation": "## What it does\nChecks for the use of `sum()` to flatten lists of lists, which has\nquadratic complexity.\n\n## Why is this bad?\nThe use of `sum()` to flatten lists of lists is quadratic in the number of\nlists, as `sum()` creates a new list for each element in the summation.\n\nInstead, consider using another method of flattening lists to avoid\nquadratic complexity. The following methods are all linear in the number of\nlists:\n\n- `functools.reduce(operator.iadd, lists, [])`\n- `list(itertools.chain.from_iterable(lists))`\n- `[item for sublist in lists for item in sublist]`\n\nWhen fixing relevant violations, Ruff defaults to the `functools.reduce`\nform, which outperforms the other methods in [microbenchmarks].\n\n## Example\n```python\nlists = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\njoined = sum(lists, [])\n```\n\nUse instead:\n```python\nimport functools\nimport operator\n\n\nlists = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nfunctools.reduce(operator.iadd, lists, [])\n```\n\n## References\n- [_How Not to Flatten a List of Lists in Python_](https://mathieularose.com/how-not-to-flatten-a-list-of-lists-in-python)\n- [_How do I make a flat list out of a list of lists?_](https://stackoverflow.com/questions/952914/how-do-i-make-a-flat-list-out-of-a-list-of-lists/953097#953097)\n\n[microbenchmarks]: https://github.com/astral-sh/ruff/issues/5073#issuecomment-1591836349\n",
    "fix": 2
  },
  {
    "name": "assignment-in-assert",
    "code": "RUF018",
    "explanation": "## What it does\nChecks for named assignment expressions (e.g., `x := 0`) in `assert`\nstatements.\n\n## Why is this bad?\nNamed assignment expressions (also known as \"walrus operators\") are used to\nassign a value to a variable as part of a larger expression.\n\nNamed assignments are syntactically valid in `assert` statements. However,\nwhen the Python interpreter is run under the `-O` flag, `assert` statements\nare not executed. In this case, the named assignment will also be ignored,\nwhich may result in unexpected behavior (e.g., undefined variable\naccesses).\n\n## Example\n```python\nassert (x := 0) == 0\nprint(x)\n```\n\nUse instead:\n```python\nx = 0\nassert x == 0\nprint(x)\n```\n\nThe rule avoids flagging named expressions that define variables which are\nonly referenced from inside `assert` statements; the following will not\ntrigger the rule:\n```python\nassert (x := y**2) > 42, f\"Expected >42 but got {x}\"\n```\n\nNor will this:\n```python\nassert (x := y**2) > 42\nassert x < 1_000_000\n```\n\n## References\n- [Python documentation: `-O`](https://docs.python.org/3/using/cmdline.html#cmdoption-O)\n"
  },
  {
    "name": "unnecessary-key-check",
    "code": "RUF019",
    "explanation": "## What it does\nChecks for unnecessary key checks prior to accessing a dictionary.\n\n## Why is this bad?\nWhen working with dictionaries, the `get` can be used to access a value\nwithout having to check if the dictionary contains the relevant key,\nreturning `None` if the key is not present.\n\n## Example\n```python\nif \"key\" in dct and dct[\"key\"]:\n    ...\n```\n\nUse instead:\n```python\nif dct.get(\"key\"):\n    ...\n```\n",
    "fix": 2
  },
  {
    "name": "never-union",
    "code": "RUF020",
    "explanation": "## What it does\nChecks for uses of `typing.NoReturn` and `typing.Never` in union types.\n\n## Why is this bad?\n`typing.NoReturn` and `typing.Never` are special types, used to indicate\nthat a function never returns, or that a type has no values.\n\nIncluding `typing.NoReturn` or `typing.Never` in a union type is redundant,\nas, e.g., `typing.Never | T` is equivalent to `T`.\n\n## Example\n\n```python\nfrom typing import Never\n\n\ndef func() -> Never | int: ...\n```\n\nUse instead:\n\n```python\ndef func() -> int: ...\n```\n\n## References\n- [Python documentation: `typing.Never`](https://docs.python.org/3/library/typing.html#typing.Never)\n- [Python documentation: `typing.NoReturn`](https://docs.python.org/3/library/typing.html#typing.NoReturn)\n",
    "fix": 1
  },
  {
    "name": "parenthesize-chained-operators",
    "code": "RUF021",
    "explanation": "## What it does\nChecks for chained operators where adding parentheses could improve the\nclarity of the code.\n\n## Why is this bad?\n`and` always binds more tightly than `or` when chaining the two together,\nbut this can be hard to remember (and sometimes surprising).\nAdding parentheses in these situations can greatly improve code readability,\nwith no change to semantics or performance.\n\nFor example:\n```python\na, b, c = 1, 0, 2\nx = a or b and c\n\nd, e, f = 0, 1, 2\ny = d and e or f\n```\n\nUse instead:\n```python\na, b, c = 1, 0, 2\nx = a or (b and c)\n\nd, e, f = 0, 1, 2\ny = (d and e) or f\n```\n",
    "fix": 2
  },
  {
    "name": "unsorted-dunder-all",
    "code": "RUF022",
    "explanation": "## What it does\nChecks for `__all__` definitions that are not ordered\naccording to an \"isort-style\" sort.\n\nAn isort-style sort orders items first according to their casing:\nSCREAMING_SNAKE_CASE names (conventionally used for global constants)\ncome first, followed by CamelCase names (conventionally used for\nclasses), followed by anything else. Within each category,\na [natural sort](https://en.wikipedia.org/wiki/Natural_sort_order)\nis used to order the elements.\n\n## Why is this bad?\nConsistency is good. Use a common convention for `__all__` to make your\ncode more readable and idiomatic.\n\n## Example\n```python\nimport sys\n\n__all__ = [\n    \"b\",\n    \"c\",\n    \"a\",\n]\n\nif sys.platform == \"win32\":\n    __all__ += [\"z\", \"y\"]\n```\n\nUse instead:\n```python\nimport sys\n\n__all__ = [\n    \"a\",\n    \"b\",\n    \"c\",\n]\n\nif sys.platform == \"win32\":\n    __all__ += [\"y\", \"z\"]\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe if there are any comments that take up\na whole line by themselves inside the `__all__` definition, for example:\n```py\n__all__ = [\n    # eggy things\n    \"duck_eggs\",\n    \"chicken_eggs\",\n    # hammy things\n    \"country_ham\",\n    \"parma_ham\",\n]\n```\n\nThis is a common pattern used to delimit categories within a module's API,\nbut it would be out of the scope of this rule to attempt to maintain these\ncategories when alphabetically sorting the items of `__all__`.\n\nThe fix is also marked as unsafe if there are more than two `__all__` items\non a single line and that line also has a trailing comment, since here it\nis impossible to accurately gauge which item the comment should be moved\nwith when sorting `__all__`:\n```py\n__all__ = [\n    \"a\", \"c\", \"e\",  # a comment\n    \"b\", \"d\", \"f\",  # a second  comment\n]\n```\n\nOther than this, the rule's fix is marked as always being safe, in that\nit should very rarely alter the semantics of any Python code.\nHowever, note that (although it's rare) the value of `__all__`\ncould be read by code elsewhere that depends on the exact\niteration order of the items in `__all__`, in which case this\nrule's fix could theoretically cause breakage.\n",
    "fix": 1
  },
  {
    "name": "unsorted-dunder-slots",
    "code": "RUF023",
    "explanation": "## What it does\nChecks for `__slots__` definitions that are not ordered according to a\n[natural sort](https://en.wikipedia.org/wiki/Natural_sort_order).\n\n## Why is this bad?\nConsistency is good. Use a common convention for this special variable\nto make your code more readable and idiomatic.\n\n## Example\n```python\nclass Dog:\n    __slots__ = \"name\", \"breed\"\n```\n\nUse instead:\n```python\nclass Dog:\n    __slots__ = \"breed\", \"name\"\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe in three situations.\n\nFirstly, the fix is unsafe if there are any comments that take up\na whole line by themselves inside the `__slots__` definition, for example:\n```py\nclass Foo:\n    __slots__ = [\n        # eggy things\n        \"duck_eggs\",\n        \"chicken_eggs\",\n        # hammy things\n        \"country_ham\",\n        \"parma_ham\",\n    ]\n```\n\nThis is a common pattern used to delimit categories within a class's slots,\nbut it would be out of the scope of this rule to attempt to maintain these\ncategories when applying a natural sort to the items of `__slots__`.\n\nSecondly, the fix is also marked as unsafe if there are more than two\n`__slots__` items on a single line and that line also has a trailing\ncomment, since here it is impossible to accurately gauge which item the\ncomment should be moved with when sorting `__slots__`:\n```py\nclass Bar:\n    __slots__ = [\n        \"a\", \"c\", \"e\",  # a comment\n        \"b\", \"d\", \"f\",  # a second  comment\n    ]\n```\n\nLastly, this rule's fix is marked as unsafe whenever Ruff can detect that\ncode elsewhere in the same file reads the `__slots__` variable in some way\nand the `__slots__` variable is not assigned to a set. This is because the\norder of the items in `__slots__` may have semantic significance if the\n`__slots__` of a class is being iterated over, or being assigned to another\nvalue.\n\nIn the vast majority of other cases, this rule's fix is unlikely to\ncause breakage; as such, Ruff will otherwise mark this rule's fix as\nsafe. However, note that (although it's rare) the value of `__slots__`\ncould still be read by code outside of the module in which the\n`__slots__` definition occurs, in which case this rule's fix could\ntheoretically cause breakage.\n",
    "fix": 1
  },
  {
    "name": "mutable-fromkeys-value",
    "code": "RUF024",
    "explanation": "## What it does\nChecks for mutable objects passed as a value argument to `dict.fromkeys`.\n\n## Why is this bad?\nAll values in the dictionary created by the `dict.fromkeys` method\nrefer to the same instance of the provided object. If that object is\nmodified, all values are modified, which can lead to unexpected behavior.\nFor example, if the empty list (`[]`) is provided as the default value,\nall values in the dictionary will use the same list; as such, appending to\nany one entry will append to all entries.\n\nInstead, use a comprehension to generate a dictionary with distinct\ninstances of the default value.\n\n## Example\n```python\ncities = dict.fromkeys([\"UK\", \"Poland\"], [])\ncities[\"UK\"].append(\"London\")\ncities[\"Poland\"].append(\"Poznan\")\nprint(cities)  # {'UK': ['London', 'Poznan'], 'Poland': ['London', 'Poznan']}\n```\n\nUse instead:\n```python\ncities = {country: [] for country in [\"UK\", \"Poland\"]}\ncities[\"UK\"].append(\"London\")\ncities[\"Poland\"].append(\"Poznan\")\nprint(cities)  # {'UK': ['London'], 'Poland': ['Poznan']}\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as the edit will change the behavior of\nthe program by using a distinct object for every value in the dictionary,\nrather than a shared mutable instance. In some cases, programs may rely on\nthe previous behavior.\n\n## References\n- [Python documentation: `dict.fromkeys`](https://docs.python.org/3/library/stdtypes.html#dict.fromkeys)\n",
    "fix": 1
  },
  {
    "name": "default-factory-kwarg",
    "code": "RUF026",
    "explanation": "## What it does\nChecks for incorrect usages of `default_factory` as a keyword argument when\ninitializing a `defaultdict`.\n\n## Why is this bad?\nThe `defaultdict` constructor accepts a callable as its first argument.\nFor example, it's common to initialize a `defaultdict` with `int` or `list`\nvia `defaultdict(int)` or `defaultdict(list)`, to create a dictionary that\nreturns `0` or `[]` respectively when a key is missing.\n\nThe default factory _must_ be provided as a positional argument, as all\nkeyword arguments to `defaultdict` are interpreted as initial entries in\nthe dictionary. For example, `defaultdict(foo=1, bar=2)` will create a\ndictionary with `{\"foo\": 1, \"bar\": 2}` as its initial entries.\n\nAs such, `defaultdict(default_factory=list)` will create a dictionary with\n`{\"default_factory\": list}` as its initial entry, instead of a dictionary\nthat returns `[]` when a key is missing. Specifying a `default_factory`\nkeyword argument is almost always a mistake, and one that type checkers\ncan't reliably detect.\n\n## Fix safety\nThis rule's fix is marked as unsafe, as converting `default_factory` from a\nkeyword to a positional argument will change the behavior of the code, even\nif the keyword argument was used erroneously.\n\n## Example\n```python\ndefaultdict(default_factory=int)\ndefaultdict(default_factory=list)\n```\n\nUse instead:\n```python\ndefaultdict(int)\ndefaultdict(list)\n```\n",
    "fix": 1
  },
  {
    "name": "missing-f-string-syntax",
    "code": "RUF027",
    "explanation": "## What it does\nSearches for strings that look like they were meant to be f-strings, but are missing an `f` prefix.\n\n## Why is this bad?\nExpressions inside curly braces are only evaluated if the string has an `f` prefix.\n\n## Details\n\nThere are many possible string literals which are not meant to be f-strings\ndespite containing f-string-like syntax. As such, this lint ignores all strings\nwhere one of the following conditions applies:\n\n1. The string is a standalone expression. For example, the rule ignores all docstrings.\n2. The string is part of a function call with argument names that match at least one variable\n   (for example: `format(\"Message: {value}\", value=\"Hello World\")`)\n3. The string (or a parent expression of the string) has a direct method call on it\n   (for example: `\"{value}\".format(...)`)\n4. The string has no `{...}` expression sections, or uses invalid f-string syntax.\n5. The string references variables that are not in scope, or it doesn't capture variables at all.\n6. Any format specifiers in the potential f-string are invalid.\n7. The string is part of a function call that is known to expect a template string rather than an\n   evaluated f-string: for example, a [`logging`][logging] call, a [`gettext`][gettext] call,\n   or a [FastAPI path].\n\n## Example\n\n```python\nname = \"Sarah\"\nday_of_week = \"Tuesday\"\nprint(\"Hello {name}! It is {day_of_week} today!\")\n```\n\nUse instead:\n```python\nname = \"Sarah\"\nday_of_week = \"Tuesday\"\nprint(f\"Hello {name}! It is {day_of_week} today!\")\n```\n\n[logging]: https://docs.python.org/3/howto/logging-cookbook.html#using-particular-formatting-styles-throughout-your-application\n[gettext]: https://docs.python.org/3/library/gettext.html\n[FastAPI path]: https://fastapi.tiangolo.com/tutorial/path-params/\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "invalid-formatter-suppression-comment",
    "code": "RUF028",
    "explanation": "## What it does\nChecks for formatter suppression comments that are ineffective or incompatible\nwith Ruff's formatter.\n\n## Why is this bad?\nSuppression comments that do not actually prevent formatting could cause unintended changes\nwhen the formatter is run.\n\n## Example\nIn the following example, all suppression comments would cause\na rule violation.\n\n```python\ndef decorator():\n    pass\n\n\n@decorator\n# fmt: off\ndef example():\n    if True:\n        # fmt: skip\n        expression = [\n            # fmt: off\n            1,\n            2,\n        ]\n        # yapf: disable\n    # fmt: on\n    # yapf: enable\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "unused-async",
    "code": "RUF029",
    "explanation": "## What it does\nChecks for functions declared `async` that do not await or otherwise use features requiring the\nfunction to be declared `async`.\n\n## Why is this bad?\nDeclaring a function `async` when it's not is usually a mistake, and will artificially limit the\ncontexts where that function may be called. In some cases, labeling a function `async` is\nsemantically meaningful (e.g. with the trio library).\n\n## Example\n```python\nasync def foo():\n    bar()\n```\n\nUse instead:\n```python\ndef foo():\n    bar()\n```\n",
    "preview": true
  },
  {
    "name": "assert-with-print-message",
    "code": "RUF030",
    "explanation": "## What it does\nChecks for uses of `assert expression, print(message)`.\n\n## Why is this bad?\nIf an `assert x, y` assertion fails, the Python interpreter raises an\n`AssertionError`, and the evaluated value of `y` is used as the contents of\nthat assertion error. The `print` function always returns `None`, however,\nso the evaluated value of a call to `print` will always be `None`.\n\nUsing a `print` call in this context will therefore output the message to\n`stdout`, before raising an empty `AssertionError(None)`. Instead, remove\nthe `print` and pass the message directly as the second expression,\nallowing `stderr` to capture the message in a well-formatted context.\n\n## Example\n```python\nassert False, print(\"This is a message\")\n```\n\nUse instead:\n```python\nassert False, \"This is a message\"\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as changing the second expression\nwill result in a different `AssertionError` message being raised, as well as\na change in `stdout` output.\n\n## References\n- [Python documentation: `assert`](https://docs.python.org/3/reference/simple_stmts.html#the-assert-statement)\n",
    "fix": 2
  },
  {
    "name": "incorrectly-parenthesized-tuple-in-subscript",
    "code": "RUF031",
    "explanation": "## What it does\nChecks for consistent style regarding whether nonempty tuples in subscripts\nare parenthesized.\n\nThe exact nature of this violation depends on the setting\n[`lint.ruff.parenthesize-tuple-in-subscript`]. By default, the use of\nparentheses is considered a violation.\n\nThis rule is not applied inside \"typing contexts\" (type annotations,\ntype aliases and subscripted class bases), as these have their own specific\nconventions around them.\n\n## Why is this bad?\nIt is good to be consistent and, depending on the codebase, one or the other\nconvention may be preferred.\n\n## Example\n\n```python\ndirections = {(0, 1): \"North\", (1, 0): \"East\", (0, -1): \"South\", (-1, 0): \"West\"}\ndirections[(0, 1)]\n```\n\nUse instead (with default setting):\n\n```python\ndirections = {(0, 1): \"North\", (1, 0): \"East\", (0, -1): \"South\", (-1, 0): \"West\"}\ndirections[0, 1]\n```\n\n## Options\n- `lint.ruff.parenthesize-tuple-in-subscript`\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "decimal-from-float-literal",
    "code": "RUF032",
    "explanation": "## What it does\nChecks for `Decimal` calls passing a float literal.\n\n## Why is this bad?\nFloat literals have limited precision that can lead to unexpected results.\nThe `Decimal` class is designed to handle numbers with fixed-point precision,\nso a string literal should be used instead.\n\n## Example\n\n```python\nnum = Decimal(1.2345)\n```\n\nUse instead:\n```python\nnum = Decimal(\"1.2345\")\n```\n\n## Fix Safety\nThis rule's fix is marked as unsafe because it changes the underlying value\nof the `Decimal` instance that is constructed. This can lead to unexpected\nbehavior if your program relies on the previous value (whether deliberately or not).\n",
    "fix": 2
  },
  {
    "name": "post-init-default",
    "code": "RUF033",
    "explanation": "## What it does\nChecks for `__post_init__` dataclass methods with parameter defaults.\n\n## Why is this bad?\nAdding a default value to a parameter in a `__post_init__` method has no\nimpact on whether the parameter will have a default value in the dataclass's\ngenerated `__init__` method. To create an init-only dataclass parameter with\na default value, you should use an `InitVar` field in the dataclass's class\nbody and give that `InitVar` field a default value.\n\nAs the [documentation] states:\n\n> Init-only fields are added as parameters to the generated `__init__()`\n> method, and are passed to the optional `__post_init__()` method. They are\n> not otherwise used by dataclasses.\n\n## Example\n```python\nfrom dataclasses import InitVar, dataclass\n\n\n@dataclass\nclass Foo:\n    bar: InitVar[int] = 0\n\n    def __post_init__(self, bar: int = 1, baz: int = 2) -> None:\n        print(bar, baz)\n\n\nfoo = Foo()  # Prints '0 2'.\n```\n\nUse instead:\n```python\nfrom dataclasses import InitVar, dataclass\n\n\n@dataclass\nclass Foo:\n    bar: InitVar[int] = 1\n    baz: InitVar[int] = 2\n\n    def __post_init__(self, bar: int, baz: int) -> None:\n        print(bar, baz)\n\n\nfoo = Foo()  # Prints '1 2'.\n```\n\n## References\n- [Python documentation: Post-init processing](https://docs.python.org/3/library/dataclasses.html#post-init-processing)\n- [Python documentation: Init-only variables](https://docs.python.org/3/library/dataclasses.html#init-only-variables)\n\n[documentation]: https://docs.python.org/3/library/dataclasses.html#init-only-variables\n",
    "fix": 1
  },
  {
    "name": "useless-if-else",
    "code": "RUF034",
    "explanation": "## What it does\nChecks for useless `if`-`else` conditions with identical arms.\n\n## Why is this bad?\nUseless `if`-`else` conditions add unnecessary complexity to the code without\nproviding any logical benefit. Assigning the value directly is clearer.\n\n## Example\n```python\nfoo = x if y else x\n```\n\nUse instead:\n```python\nfoo = x\n```\n"
  },
  {
    "name": "ruff-unsafe-markup-use",
    "code": "RUF035",
    "explanation": "## Removed\nThis rule was implemented in `bandit` and has been remapped to\n[S704](unsafe-markup-use.md)\n\n## What it does\nChecks for non-literal strings being passed to [`markupsafe.Markup`][markupsafe-markup].\n\n## Why is this bad?\n[`markupsafe.Markup`][markupsafe-markup] does not perform any escaping,\nso passing dynamic content, like f-strings, variables or interpolated strings\nwill potentially lead to XSS vulnerabilities.\n\nInstead you should interpolate the `Markup` object.\n\nUsing [`lint.flake8-bandit.extend-markup-names`] additional objects can be\ntreated like `Markup`.\n\nThis rule was originally inspired by [flake8-markupsafe] but doesn't carve\nout any exceptions for i18n related calls by default.\n\nYou can use [`lint.flake8-bandit.allowed-markup-calls`] to specify exceptions.\n\n## Example\nGiven:\n```python\nfrom markupsafe import Markup\n\ncontent = \"<script>alert('Hello, world!')</script>\"\nhtml = Markup(f\"<b>{content}</b>\")  # XSS\n```\n\nUse instead:\n```python\nfrom markupsafe import Markup\n\ncontent = \"<script>alert('Hello, world!')</script>\"\nhtml = Markup(\"<b>{}</b>\").format(content)  # Safe\n```\n\nGiven:\n```python\nfrom markupsafe import Markup\n\nlines = [\n    Markup(\"<b>heading</b>\"),\n    \"<script>alert('XSS attempt')</script>\",\n]\nhtml = Markup(\"<br>\".join(lines))  # XSS\n```\n\nUse instead:\n```python\nfrom markupsafe import Markup\n\nlines = [\n    Markup(\"<b>heading</b>\"),\n    \"<script>alert('XSS attempt')</script>\",\n]\nhtml = Markup(\"<br>\").join(lines)  # Safe\n```\n## Options\n- `lint.flake8-bandit.extend-markup-names`\n- `lint.flake8-bandit.allowed-markup-calls`\n\n## References\n- [MarkupSafe on PyPI](https://pypi.org/project/MarkupSafe/)\n- [`markupsafe.Markup` API documentation](https://markupsafe.palletsprojects.com/en/stable/escaping/#markupsafe.Markup)\n\n[markupsafe-markup]: https://markupsafe.palletsprojects.com/en/stable/escaping/#markupsafe.Markup\n[flake8-markupsafe]: https://github.com/vmagamedov/flake8-markupsafe\n"
  },
  {
    "name": "none-not-at-end-of-union",
    "code": "RUF036",
    "explanation": "## What it does\nChecks for type annotations where `None` is not at the end of an union.\n\n## Why is this bad?\nType annotation unions are associative, meaning that the order of the elements\ndoes not matter. The `None` literal represents the absence of a value. For\nreadability, it's preferred to write the more informative type expressions first.\n\n## Example\n```python\ndef func(arg: None | int): ...\n```\n\nUse instead:\n```python\ndef func(arg: int | None): ...\n```\n\n## References\n- [Python documentation: Union type](https://docs.python.org/3/library/stdtypes.html#types-union)\n- [Python documentation: `typing.Optional`](https://docs.python.org/3/library/typing.html#typing.Optional)\n- [Python documentation: `None`](https://docs.python.org/3/library/constants.html#None)\n",
    "preview": true
  },
  {
    "name": "unnecessary-empty-iterable-within-deque-call",
    "code": "RUF037",
    "explanation": "## What it does\nChecks for usages of `collections.deque` that have an empty iterable as the first argument.\n\n## Why is this bad?\nIt's unnecessary to use an empty literal as a deque's iterable, since this is already the default behavior.\n\n## Example\n\n```python\nfrom collections import deque\n\nqueue = deque(set())\nqueue = deque([], 10)\n```\n\nUse instead:\n\n```python\nfrom collections import deque\n\nqueue = deque()\nqueue = deque(maxlen=10)\n```\n\n## References\n- [Python documentation: `collections.deque`](https://docs.python.org/3/library/collections.html#collections.deque)\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "redundant-bool-literal",
    "code": "RUF038",
    "explanation": "## What it does\nChecks for `Literal[True, False]` type annotations.\n\n## Why is this bad?\n`Literal[True, False]` can be replaced with `bool` in type annotations,\nwhich has the same semantic meaning but is more concise and readable.\n\n`bool` type has exactly two constant instances: `True` and `False`. Static\ntype checkers such as [mypy] treat `Literal[True, False]` as equivalent to\n`bool` in a type annotation.\n\n## Example\n```python\nfrom typing import Literal\n\nx: Literal[True, False]\ny: Literal[True, False, \"hello\", \"world\"]\n```\n\nUse instead:\n```python\nfrom typing import Literal\n\nx: bool\ny: Literal[\"hello\", \"world\"] | bool\n```\n\n## Fix safety\nThe fix for this rule is marked as unsafe, as it may change the semantics of the code.\nSpecifically:\n\n- Type checkers may not treat `bool` as equivalent when overloading boolean arguments\n  with `Literal[True]` and `Literal[False]` (see, e.g., [#14764] and [#5421]).\n- `bool` is not strictly equivalent to `Literal[True, False]`, as `bool` is\n  a subclass of `int`, and this rule may not apply if the type annotations are used\n  in a numeric context.\n\nFurther, the `Literal` slice may contain trailing-line comments which the fix would remove.\n\n## References\n- [Typing documentation: Legal parameters for `Literal` at type check time](https://typing.readthedocs.io/en/latest/spec/literal.html#legal-parameters-for-literal-at-type-check-time)\n- [Python documentation: Boolean type - `bool`](https://docs.python.org/3/library/stdtypes.html#boolean-type-bool)\n\n[mypy]: https://github.com/python/mypy/blob/master/mypy/typeops.py#L985\n[#14764]: https://github.com/python/mypy/issues/14764\n[#5421]: https://github.com/microsoft/pyright/issues/5421\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "unraw-re-pattern",
    "code": "RUF039",
    "explanation": "## What it does\nReports the following `re` and `regex` calls when\ntheir first arguments are not raw strings:\n\n- For `regex` and `re`: `compile`, `findall`, `finditer`,\n  `fullmatch`, `match`, `search`, `split`, `sub`, `subn`.\n- `regex`-specific: `splititer`, `subf`, `subfn`, `template`.\n\n## Why is this bad?\nRegular expressions should be written\nusing raw strings to avoid double escaping.\n\n## Example\n\n```python\nre.compile(\"foo\\\\bar\")\n```\n\nUse instead:\n\n```python\nre.compile(r\"foo\\bar\")\n```\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "invalid-assert-message-literal-argument",
    "code": "RUF040",
    "explanation": "## What it does\nChecks for invalid use of literals in assert message arguments.\n\n## Why is this bad?\nAn assert message which is a non-string literal was likely intended\nto be used in a comparison assertion, rather than as a message.\n\n## Example\n```python\nfruits = [\"apples\", \"plums\", \"pears\"]\nfruits.filter(lambda fruit: fruit.startwith(\"p\"))\nassert len(fruits), 2  # True unless the list is empty\n```\n\nUse instead:\n```python\nfruits = [\"apples\", \"plums\", \"pears\"]\nfruits.filter(lambda fruit: fruit.startwith(\"p\"))\nassert len(fruits) == 2\n```\n"
  },
  {
    "name": "unnecessary-nested-literal",
    "code": "RUF041",
    "explanation": "## What it does\nChecks for unnecessary nested `Literal`.\n\n## Why is this bad?\nPrefer using a single `Literal`, which is equivalent and more concise.\n\nParameterization of literals by other literals is supported as an ergonomic\nfeature as proposed in [PEP 586], to enable patterns such as:\n```python\nReadOnlyMode         = Literal[\"r\", \"r+\"]\nWriteAndTruncateMode = Literal[\"w\", \"w+\", \"wt\", \"w+t\"]\nWriteNoTruncateMode  = Literal[\"r+\", \"r+t\"]\nAppendMode           = Literal[\"a\", \"a+\", \"at\", \"a+t\"]\n\nAllModes = Literal[ReadOnlyMode, WriteAndTruncateMode,\n                  WriteNoTruncateMode, AppendMode]\n```\n\nAs a consequence, type checkers also support nesting of literals\nwhich is less readable than a flat `Literal`:\n```python\nAllModes = Literal[Literal[\"r\", \"r+\"], Literal[\"w\", \"w+\", \"wt\", \"w+t\"],\n                  Literal[\"r+\", \"r+t\"], Literal[\"a\", \"a+\", \"at\", \"a+t\"]]\n```\n\n## Example\n```python\nAllModes = Literal[\n    Literal[\"r\", \"r+\"],\n    Literal[\"w\", \"w+\", \"wt\", \"w+t\"],\n    Literal[\"r+\", \"r+t\"],\n    Literal[\"a\", \"a+\", \"at\", \"a+t\"],\n]\n```\n\nUse instead:\n```python\nAllModes = Literal[\n    \"r\", \"r+\", \"w\", \"w+\", \"wt\", \"w+t\", \"r+\", \"r+t\", \"a\", \"a+\", \"at\", \"a+t\"\n]\n```\n\nor assign the literal to a variable as in the first example.\n\n## Fix safety\nThe fix for this rule is marked as unsafe when the `Literal` slice is split\nacross multiple lines and some of the lines have trailing comments.\n\n## References\n- [Typing documentation: Legal parameters for `Literal` at type check time](https://typing.readthedocs.io/en/latest/spec/literal.html#legal-parameters-for-literal-at-type-check-time)\n\n[PEP 586](https://peps.python.org/pep-0586/)\n",
    "fix": 1
  },
  {
    "name": "pytest-raises-ambiguous-pattern",
    "code": "RUF043",
    "explanation": "## What it does\nChecks for non-raw literal string arguments passed to the `match` parameter\nof `pytest.raises()` where the string contains at least one unescaped\nregex metacharacter.\n\n## Why is this bad?\nThe `match` argument is implicitly converted to a regex under the hood.\nIt should be made explicit whether the string is meant to be a regex or a \"plain\" pattern\nby prefixing the string with the `r` suffix, escaping the metacharacter(s)\nin the string using backslashes, or wrapping the entire string in a call to\n`re.escape()`.\n\n## Example\n\n```python\nimport pytest\n\n\nwith pytest.raises(Exception, match=\"A full sentence.\"):\n    do_thing_that_raises()\n```\n\nUse instead:\n\n```python\nimport pytest\n\n\nwith pytest.raises(Exception, match=r\"A full sentence.\"):\n    do_thing_that_raises()\n```\n\nAlternatively:\n\n```python\nimport pytest\nimport re\n\n\nwith pytest.raises(Exception, match=re.escape(\"A full sentence.\")):\n    do_thing_that_raises()\n```\n\nor:\n\n```python\nimport pytest\nimport re\n\n\nwith pytest.raises(Exception, \"A full sentence\\\\.\"):\n    do_thing_that_raises()\n```\n\n## References\n- [Python documentation: `re.escape`](https://docs.python.org/3/library/re.html#re.escape)\n- [`pytest` documentation: `pytest.raises`](https://docs.pytest.org/en/latest/reference/reference.html#pytest-raises)\n",
    "preview": true
  },
  {
    "name": "implicit-class-var-in-dataclass",
    "code": "RUF045",
    "explanation": "## What it does\nChecks for implicit class variables in dataclasses.\n\nVariables matching the [`lint.dummy-variable-rgx`] are excluded\nfrom this rule.\n\n## Why is this bad?\nClass variables are shared between all instances of that class.\nIn dataclasses, fields with no annotations at all\nare implicitly considered class variables, and a `TypeError` is\nraised if a user attempts to initialize an instance of the class\nwith this field.\n\n\n```python\n@dataclass\nclass C:\n    a = 1\n    b: str = \"\"\n\nC(a = 42)  # TypeError: C.__init__() got an unexpected keyword argument 'a'\n```\n\n## Example\n\n```python\n@dataclass\nclass C:\n    a = 1\n```\n\nUse instead:\n\n```python\nfrom typing import ClassVar\n\n\n@dataclass\nclass C:\n    a: ClassVar[int] = 1\n```\n\n## Options\n- [`lint.dummy-variable-rgx`]\n",
    "preview": true
  },
  {
    "name": "unnecessary-cast-to-int",
    "code": "RUF046",
    "explanation": "## What it does\nChecks for `int` conversions of values that are already integers.\n\n## Why is this bad?\nSuch a conversion is unnecessary.\n\n## Known problems\nThis rule may produce false positives for `round`, `math.ceil`, `math.floor`,\nand `math.trunc` calls when values override the `__round__`, `__ceil__`, `__floor__`,\nor `__trunc__` operators such that they don't return an integer.\n\n## Example\n\n```python\nint(len([]))\nint(round(foo, None))\n```\n\nUse instead:\n\n```python\nlen([])\nround(foo)\n```\n\n## Fix safety\nThe fix for `round`, `math.ceil`, `math.floor`, and `math.truncate` is unsafe\nbecause removing the `int` conversion can change the semantics for values\noverriding the `__round__`, `__ceil__`, `__floor__`, or `__trunc__` dunder methods\nsuch that they don't return an integer.\n",
    "fix": 2
  },
  {
    "name": "needless-else",
    "code": "RUF047",
    "explanation": "## What it does\nChecks for `else` clauses that only contains `pass` and `...` statements.\n\n## Why is this bad?\nSuch an else clause does nothing and can be removed.\n\n## Example\n```python\nif foo:\n    bar()\nelse:\n    pass\n```\n\nUse instead:\n```python\nif foo:\n    bar()\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "map-int-version-parsing",
    "code": "RUF048",
    "explanation": "## What it does\nChecks for calls of the form `map(int, __version__.split(\".\"))`.\n\n## Why is this bad?\n`__version__` does not always contain integral-like elements.\n\n```python\nimport matplotlib  # `__version__ == \"3.9.1.post-1\"` in our environment\n\n# ValueError: invalid literal for int() with base 10: 'post1'\ntuple(map(int, matplotlib.__version__.split(\".\")))\n```\n\nSee also [*Version specifiers* | Packaging spec][version-specifier].\n\n## Example\n```python\ntuple(map(int, matplotlib.__version__.split(\".\")))\n```\n\nUse instead:\n```python\nimport packaging.version as version\n\nversion.parse(matplotlib.__version__)\n```\n\n[version-specifier]: https://packaging.python.org/en/latest/specifications/version-specifiers/#version-specifiers\n"
  },
  {
    "name": "dataclass-enum",
    "code": "RUF049",
    "explanation": "## What it does\nChecks for enum classes which are also decorated with `@dataclass`.\n\n## Why is this bad?\nDecorating an enum with `@dataclass()` does not cause any errors at runtime,\nbut may cause erroneous results:\n\n```python\n@dataclass\nclass E(Enum):\n    A = 1\n    B = 2\n\nprint(E.A == E.B)  # True\n```\n\n## Example\n\n```python\nfrom dataclasses import dataclass\nfrom enum import Enum\n\n\n@dataclass\nclass E(Enum): ...\n```\n\nUse instead:\n\n```python\nfrom enum import Enum\n\n\nclass E(Enum): ...\n```\n\n## References\n- [Python documentation: Enum HOWTO &sect; Dataclass support](https://docs.python.org/3/howto/enum.html#dataclass-support)\n",
    "preview": true
  },
  {
    "name": "if-key-in-dict-del",
    "code": "RUF051",
    "explanation": "## What it does\nChecks for `if key in dictionary: del dictionary[key]`.\n\n## Why is this bad?\nTo remove a key-value pair from a dictionary, it's more concise to use `.pop(..., None)`.\n\n## Example\n\n```python\nif key in dictionary:\n    del dictionary[key]\n```\n\nUse instead:\n\n```python\ndictionary.pop(key, None)\n```\n\n## Fix safety\nThis rule's fix is marked as safe, unless the if statement contains comments.\n",
    "fix": 2
  },
  {
    "name": "used-dummy-variable",
    "code": "RUF052",
    "explanation": "## What it does\nChecks for \"dummy variables\" (variables that are named as if to indicate they are unused)\nthat are in fact used.\n\nBy default, \"dummy variables\" are any variables with names that start with leading\nunderscores. However, this is customisable using the [`lint.dummy-variable-rgx`] setting).\n\n## Why is this bad?\nMarking a variable with a leading underscore conveys that it is intentionally unused within the function or method.\nWhen these variables are later referenced in the code, it causes confusion and potential misunderstandings about\nthe code's intention. If a variable marked as \"unused\" is subsequently used, it suggests that either the variable\ncould be given a clearer name, or that the code is accidentally making use of the wrong variable.\n\nSometimes leading underscores are used to avoid variables shadowing other variables, Python builtins, or Python\nkeywords. However, [PEP 8] recommends to use trailing underscores for this rather than leading underscores.\n\nDunder variables are ignored by this rule, as are variables named `_`.\nOnly local variables in function scopes are flagged by the rule.\n\n## Example\n```python\ndef function():\n    _variable = 3\n    # important: avoid shadowing the builtin `id()` function!\n    _id = 4\n    return _variable + _id\n```\n\nUse instead:\n```python\ndef function():\n    variable = 3\n    # important: avoid shadowing the builtin `id()` function!\n    id_ = 4\n    return variable + id_\n```\n\n## Fix availability\nThe rule's fix is only available for variables that start with leading underscores.\nIt will also only be available if the \"obvious\" new name for the variable\nwould not shadow any other known variables already accessible from the scope\nin which the variable is defined.\n\n## Fix safety\nThis rule's fix is marked as unsafe.\n\nFor this rule's fix, Ruff renames the variable and fixes up all known references to\nit so they point to the renamed variable. However, some renamings also require other\nchanges such as different arguments to constructor calls or alterations to comments.\nRuff is aware of some of these cases: `_T = TypeVar(\"_T\")` will be fixed to\n`T = TypeVar(\"T\")` if the `_T` binding is flagged by this rule. However, in general,\ncases like these are hard to detect and hard to automatically fix.\n\n## Options\n- [`lint.dummy-variable-rgx`]\n\n[PEP 8]: https://peps.python.org/pep-0008/\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "class-with-mixed-type-vars",
    "code": "RUF053",
    "explanation": "## What it does\nChecks for classes that have [PEP 695] [type parameter lists]\nwhile also inheriting from `typing.Generic` or `typing_extensions.Generic`.\n\n## Why is this bad?\nSuch classes cause errors at runtime:\n\n```python\nfrom typing import Generic, TypeVar\n\nU = TypeVar(\"U\")\n\n# TypeError: Cannot inherit from Generic[...] multiple times.\nclass C[T](Generic[U]): ...\n```\n\n## Example\n\n```python\nfrom typing import Generic, ParamSpec, TypeVar, TypeVarTuple\n\nU = TypeVar(\"U\")\nP = ParamSpec(\"P\")\nTs = TypeVarTuple(\"Ts\")\n\n\nclass C[T](Generic[U, P, *Ts]): ...\n```\n\nUse instead:\n\n```python\nclass C[T, U, **P, *Ts]: ...\n```\n\n## Fix safety\nAs the fix changes runtime behaviour, it is always marked as unsafe.\nAdditionally, comments within the fix range will not be preserved.\n\n## References\n- [Python documentation: User-defined generic types](https://docs.python.org/3/library/typing.html#user-defined-generic-types)\n- [Python documentation: type parameter lists](https://docs.python.org/3/reference/compound_stmts.html#type-params)\n- [PEP 695 - Type Parameter Syntax](https://peps.python.org/pep-0695/)\n\n[PEP 695]: https://peps.python.org/pep-0695/\n[type parameter lists]: https://docs.python.org/3/reference/compound_stmts.html#type-params\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "indented-form-feed",
    "code": "RUF054",
    "explanation": "## What it does\nChecks for form feed characters preceded by either a space or a tab.\n\n## Why is this bad?\n[The language reference][lexical-analysis-indentation] states:\n\n> A formfeed character may be present at the start of the line;\n> it will be ignored for the indentation calculations above.\n> Formfeed characters occurring elsewhere in the leading whitespace\n> have an undefined effect (for instance, they may reset the space count to zero).\n\n## Example\n\n```python\nif foo():\\n    \\fbar()\n```\n\nUse instead:\n\n```python\nif foo():\\n    bar()\n```\n\n[lexical-analysis-indentation]: https://docs.python.org/3/reference/lexical_analysis.html#indentation\n",
    "preview": true
  },
  {
    "name": "unnecessary-regular-expression",
    "code": "RUF055",
    "explanation": "## What it does\n\nChecks for uses of the `re` module that can be replaced with builtin `str` methods.\n\n## Why is this bad?\n\nPerforming checks on strings directly can make the code simpler, may require\nless escaping, and will often be faster.\n\n## Example\n\n```python\nre.sub(\"abc\", \"\", s)\n```\n\nUse instead:\n\n```python\ns.replace(\"abc\", \"\")\n```\n\n## Details\n\nThe rule reports the following calls when the first argument to the call is\na plain string literal, and no additional flags are passed:\n\n- `re.sub`\n- `re.match`\n- `re.search`\n- `re.fullmatch`\n- `re.split`\n\nFor `re.sub`, the `repl` (replacement) argument must also be a string literal,\nnot a function. For `re.match`, `re.search`, and `re.fullmatch`, the return\nvalue must also be used only for its truth value.\n\n## Fix safety\n\nThis rule's fix is marked as unsafe if the affected expression contains comments. Otherwise,\nthe fix can be applied safely.\n\n## References\n- [Python Regular Expression HOWTO: Common Problems - Use String Methods](https://docs.python.org/3/howto/regex.html#use-string-methods)\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "falsy-dict-get-fallback",
    "code": "RUF056",
    "explanation": "## What it does\nChecks for `dict.get(key, falsy_value)` calls in boolean test positions.\n\n## Why is this bad?\nThe default fallback `None` is already falsy.\n\n## Example\n\n```python\nif dict.get(key, False):\n    ...\n```\n\nUse instead:\n\n```python\nif dict.get(key):\n    ...\n```\n\n## Fix safety\nThis rule's fix is marked as safe, unless the `dict.get()` call contains comments between arguments.\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "unnecessary-round",
    "code": "RUF057",
    "explanation": "## What it does\nChecks for `round()` calls that have no effect on the input.\n\n## Why is this bad?\nRounding a value that's already an integer is unnecessary.\nIt's clearer to use the value directly.\n\n## Example\n\n```python\na = round(1, 0)\n```\n\nUse instead:\n\n```python\na = 1\n```\n",
    "preview": true,
    "fix": 2
  },
  {
    "name": "starmap-zip",
    "code": "RUF058",
    "explanation": "## What it does\nChecks for `itertools.starmap` calls where the second argument is a `zip` call.\n\n## Why is this bad?\n`zip`-ping iterables only to unpack them later from within `starmap` is unnecessary.\nFor such cases, `map()` should be used instead.\n\n## Example\n\n```python\nfrom itertools import starmap\n\n\nstarmap(func, zip(a, b))\nstarmap(func, zip(a, b, strict=True))\n```\n\nUse instead:\n\n```python\nmap(func, a, b)\nmap(func, a, b, strict=True)  # 3.14+\n```\n\n## Fix safety\n\nThis rule's fix is marked as unsafe if the `starmap` or `zip` expressions contain comments that\nwould be deleted by applying the fix. Otherwise, the fix can be applied safely.\n\n## Fix availability\n\nThis rule will emit a diagnostic but not suggest a fix if `map` has been shadowed from its\nbuiltin binding.\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "unused-unpacked-variable",
    "code": "RUF059",
    "explanation": "## What it does\nChecks for the presence of unused variables in unpacked assignments.\n\n## Why is this bad?\nA variable that is defined but never used can confuse readers.\n\nIf a variable is intentionally defined-but-not-used, it should be\nprefixed with an underscore, or some other value that adheres to the\n[`lint.dummy-variable-rgx`] pattern.\n\n## Example\n\n```python\ndef get_pair():\n    return 1, 2\n\n\ndef foo():\n    x, y = get_pair()\n    return x\n```\n\nUse instead:\n\n```python\ndef foo():\n    x, _ = get_pair()\n    return x\n```\n\n## Options\n- `lint.dummy-variable-rgx`\n",
    "preview": true,
    "fix": 1
  },
  {
    "name": "unused-noqa",
    "code": "RUF100",
    "explanation": "## What it does\nChecks for `noqa` directives that are no longer applicable.\n\n## Why is this bad?\nA `noqa` directive that no longer matches any diagnostic violations is\nlikely included by mistake, and should be removed to avoid confusion.\n\n## Example\n```python\nimport foo  # noqa: F401\n\n\ndef bar():\n    foo.bar()\n```\n\nUse instead:\n```python\nimport foo\n\n\ndef bar():\n    foo.bar()\n```\n\n## Options\n- `lint.external`\n\n## References\n- [Ruff error suppression](https://docs.astral.sh/ruff/linter/#error-suppression)\n",
    "fix": 2
  },
  {
    "name": "redirected-noqa",
    "code": "RUF101",
    "explanation": "## What it does\nChecks for `noqa` directives that use redirected rule codes.\n\n## Why is this bad?\nWhen one of Ruff's rule codes has been redirected, the implication is that the rule has\nbeen deprecated in favor of another rule or code. To keep your codebase\nconsistent and up-to-date, prefer the canonical rule code over the deprecated\ncode.\n\n## Example\n```python\nx = eval(command)  # noqa: PGH001\n```\n\nUse instead:\n```python\nx = eval(command)  # noqa: S307\n```\n",
    "fix": 2
  },
  {
    "name": "invalid-pyproject-toml",
    "code": "RUF200",
    "explanation": "## What it does\nChecks for any pyproject.toml that does not conform to the schema from the relevant PEPs.\n\n## Why is this bad?\nYour project may contain invalid metadata or configuration without you noticing\n\n## Example\n```toml\n[project]\nname = \"crab\"\nversion = \"1.0.0\"\nauthors = [\"Ferris the Crab <ferris@example.org>\"]\n```\n\nUse instead:\n```toml\n[project]\nname = \"crab\"\nversion = \"1.0.0\"\nauthors = [\n  { name = \"Ferris the Crab\", email = \"ferris@example.org\" }\n]\n```\n\n## References\n- [Specification of `[project]` in pyproject.toml](https://packaging.python.org/en/latest/specifications/declaring-project-metadata/)\n- [Specification of `[build-system]` in pyproject.toml](https://peps.python.org/pep-0518/)\n- [Draft but implemented license declaration extensions](https://peps.python.org/pep-0639)\n"
  },
  {
    "name": "raise-vanilla-class",
    "code": "TRY002",
    "explanation": "## What it does\nChecks for code that raises `Exception` or `BaseException` directly.\n\n## Why is this bad?\nHandling such exceptions requires the use of `except Exception` or\n`except BaseException`. These will capture almost _any_ raised exception,\nincluding failed assertions, division by zero, and more.\n\nPrefer to raise your own exception, or a more specific built-in\nexception, so that you can avoid over-capturing exceptions that you\ndon't intend to handle.\n\n## Example\n```python\ndef main_function():\n    if not cond:\n        raise Exception()\n\n\ndef consumer_func():\n    try:\n        do_step()\n        prepare()\n        main_function()\n    except Exception:\n        logger.error(\"Oops\")\n```\n\nUse instead:\n```python\ndef main_function():\n    if not cond:\n        raise CustomException()\n\n\ndef consumer_func():\n    try:\n        do_step()\n        prepare()\n        main_function()\n    except CustomException:\n        logger.error(\"Main function failed\")\n    except Exception:\n        logger.error(\"Oops\")\n```\n"
  },
  {
    "name": "raise-vanilla-args",
    "code": "TRY003",
    "explanation": "## What it does\nChecks for long exception messages that are not defined in the exception\nclass itself.\n\n## Why is this bad?\nBy formatting an exception message at the `raise` site, the exception class\nbecomes less reusable, and may now raise inconsistent messages depending on\nwhere it is raised.\n\nIf the exception message is instead defined within the exception class, it\nwill be consistent across all `raise` invocations.\n\nThis rule is not enforced for some built-in exceptions that are commonly\nraised with a message and would be unusual to subclass, such as\n`NotImplementedError`.\n\n## Example\n```python\nclass CantBeNegative(Exception):\n    pass\n\n\ndef foo(x):\n    if x < 0:\n        raise CantBeNegative(f\"{x} is negative\")\n```\n\nUse instead:\n```python\nclass CantBeNegative(Exception):\n    def __init__(self, number):\n        super().__init__(f\"{number} is negative\")\n\n\ndef foo(x):\n    if x < 0:\n        raise CantBeNegative(x)\n```\n"
  },
  {
    "name": "type-check-without-type-error",
    "code": "TRY004",
    "explanation": "## What it does\nChecks for type checks that do not raise `TypeError`.\n\n## Why is this bad?\nThe Python documentation states that `TypeError` should be raised upon\nencountering an inappropriate type.\n\n## Example\n```python\ndef foo(n: int):\n    if isinstance(n, int):\n        pass\n    else:\n        raise ValueError(\"n must be an integer\")\n```\n\nUse instead:\n```python\ndef foo(n: int):\n    if isinstance(n, int):\n        pass\n    else:\n        raise TypeError(\"n must be an integer\")\n```\n\n## References\n- [Python documentation: `TypeError`](https://docs.python.org/3/library/exceptions.html#TypeError)\n"
  },
  {
    "name": "reraise-no-cause",
    "code": "TRY200",
    "explanation": "## Removed\nThis rule is identical to [B904] which should be used instead.\n\n## What it does\nChecks for exceptions that are re-raised without specifying the cause via\nthe `from` keyword.\n\n## Why is this bad?\nThe `from` keyword sets the `__cause__` attribute of the exception, which\nstores the \"cause\" of the exception. The availability of an exception\n\"cause\" is useful for debugging.\n\n## Example\n```python\ndef reciprocal(n):\n    try:\n        return 1 / n\n    except ZeroDivisionError:\n        raise ValueError()\n```\n\nUse instead:\n```python\ndef reciprocal(n):\n    try:\n        return 1 / n\n    except ZeroDivisionError as exc:\n        raise ValueError() from exc\n```\n\n## References\n- [Python documentation: Exception context](https://docs.python.org/3/library/exceptions.html#exception-context)\n\n[B904]: https://docs.astral.sh/ruff/rules/raise-without-from-inside-except/\n"
  },
  {
    "name": "verbose-raise",
    "code": "TRY201",
    "explanation": "## What it does\nChecks for needless exception names in `raise` statements.\n\n## Why is this bad?\nIt's redundant to specify the exception name in a `raise` statement if the\nexception is being re-raised.\n\n## Example\n```python\ndef foo():\n    try:\n        ...\n    except ValueError as exc:\n        raise exc\n```\n\nUse instead:\n```python\ndef foo():\n    try:\n        ...\n    except ValueError:\n        raise\n```\n\n## Fix safety\nThis rule's fix is marked as unsafe, as it doesn't properly handle bound\nexceptions that are shadowed between the `except` and `raise` statements.\n",
    "fix": 2
  },
  {
    "name": "useless-try-except",
    "code": "TRY203",
    "explanation": "## What it does\nChecks for immediate uses of `raise` within exception handlers.\n\n## Why is this bad?\nCapturing an exception, only to immediately reraise it, has no effect.\nInstead, remove the error-handling code and let the exception propagate\nupwards without the unnecessary `try`-`except` block.\n\n## Example\n```python\ndef foo():\n    try:\n        bar()\n    except NotImplementedError:\n        raise\n```\n\nUse instead:\n```python\ndef foo():\n    bar()\n```\n"
  },
  {
    "name": "try-consider-else",
    "code": "TRY300",
    "explanation": "## What it does\nChecks for `return` statements in `try` blocks.\n\n## Why is this bad?\nThe `try`-`except` statement has an `else` clause for code that should\nrun _only_ if no exceptions were raised. Returns in `try` blocks may\nexhibit confusing or unwanted behavior, such as being overridden by\ncontrol flow in `except` and `finally` blocks, or unintentionally\nsuppressing an exception.\n\n## Example\n```python\nimport logging\n\n\ndef reciprocal(n):\n    try:\n        rec = 1 / n\n        print(f\"reciprocal of {n} is {rec}\")\n        return rec\n    except ZeroDivisionError:\n        logging.exception(\"Exception occurred\")\n```\n\nUse instead:\n```python\nimport logging\n\n\ndef reciprocal(n):\n    try:\n        rec = 1 / n\n    except ZeroDivisionError:\n        logging.exception(\"Exception occurred\")\n    else:\n        print(f\"reciprocal of {n} is {rec}\")\n        return rec\n```\n\n## References\n- [Python documentation: Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html)\n"
  },
  {
    "name": "raise-within-try",
    "code": "TRY301",
    "explanation": "## What it does\nChecks for `raise` statements within `try` blocks. The only `raise`s\ncaught are those that throw exceptions caught by the `try` statement itself.\n\n## Why is this bad?\nRaising and catching exceptions within the same `try` block is redundant,\nas the code can be refactored to avoid the `try` block entirely.\n\nAlternatively, the `raise` can be moved within an inner function, making\nthe exception reusable across multiple call sites.\n\n## Example\n```python\ndef bar():\n    pass\n\n\ndef foo():\n    try:\n        a = bar()\n        if not a:\n            raise ValueError\n    except ValueError:\n        raise\n```\n\nUse instead:\n```python\ndef bar():\n    raise ValueError\n\n\ndef foo():\n    try:\n        a = bar()  # refactored `bar` to raise `ValueError`\n    except ValueError:\n        raise\n```\n"
  },
  {
    "name": "error-instead-of-exception",
    "code": "TRY400",
    "explanation": "## What it does\nChecks for uses of `logging.error` instead of `logging.exception` when\nlogging an exception.\n\n## Why is this bad?\n`logging.exception` logs the exception and the traceback, while\n`logging.error` only logs the exception. The former is more appropriate\nwhen logging an exception, as the traceback is often useful for debugging.\n\n## Example\n```python\nimport logging\n\n\ndef func():\n    try:\n        raise NotImplementedError\n    except NotImplementedError:\n        logging.error(\"Exception occurred\")\n```\n\nUse instead:\n```python\nimport logging\n\n\ndef func():\n    try:\n        raise NotImplementedError\n    except NotImplementedError:\n        logging.exception(\"Exception occurred\")\n```\n\n## Fix safety\nThis rule's fix is marked as safe when run against `logging.error` calls,\nbut unsafe when marked against other logger-like calls (e.g.,\n`logger.error`), since the rule is prone to false positives when detecting\nlogger-like calls outside of the `logging` module.\n\n## References\n- [Python documentation: `logging.exception`](https://docs.python.org/3/library/logging.html#logging.exception)\n",
    "fix": 1
  },
  {
    "name": "verbose-log-message",
    "code": "TRY401",
    "explanation": "## What it does\nChecks for excessive logging of exception objects.\n\n## Why is this bad?\nWhen logging exceptions via `logging.exception`, the exception object\nis logged automatically. Including the exception object in the log\nmessage is redundant and can lead to excessive logging.\n\n## Example\n```python\ntry:\n    ...\nexcept ValueError as e:\n    logger.exception(f\"Found an error: {e}\")\n```\n\nUse instead:\n```python\ntry:\n    ...\nexcept ValueError:\n    logger.exception(\"Found an error\")\n```\n"
  }
]
