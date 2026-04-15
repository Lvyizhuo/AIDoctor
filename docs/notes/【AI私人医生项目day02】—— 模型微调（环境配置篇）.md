
大家好～ 接上一篇day01的项目介绍，今天我们正式进入实战环节！核心任务就是搭建大模型微调的开发环境——这一步我踩了无数坑，反复配置多次，要么依赖版本不兼容，要么CUDA报错，要么显存不足崩溃，尤其是在本地1660s（显存有限）和服务器Ubuntu20.04+V100（32GB）两种环境下，需要针对性调整参数。

经过多次测试，我整理出了一套可直接照抄的环境配置方案，全程用Anaconda管理环境（避免系统环境混乱），新手跟着做就能一次成功！关于conda的基本用法，大家可以参考往期内容：[【Anaconda】—— Conda常用操作](https://blog.csdn.net/Lvyizhuo/article/details/143058421?spm=1001.2014.3001.5501)，里面有详细的环境管理、包操作指令，不清楚的可以先去补个基础。

另外，后续微调时需要调参防止爆显存（尤其是本地1660s），大家可以参考 [Swift官方文档](https://swift.readthedocs.io/zh-cn/latest/index.html) 中的参数说明，里面有详细的显存控制、训练参数配置，后续微调环节我也会结合实际场景补充。

## 一、环境说明（必看！避免踩坑）

本次环境配置适配两种场景，大家根据自己的设备对应操作，核心依赖版本统一，仅后续微调参数需要调整：

- 服务器环境：Ubuntu20.04 系统 + V100（32GB 显存），性能充足，适合完整微调，无需过度限制显存；
>如果没有服务器，可以去魔搭社区去领取免费的100h的云服务器，[ModelScope-我的NoteBook](https://modelscope.cn/my/mynotebook)

- 本地环境：1660s 显卡（显存有限），需在后续微调时调整量化参数、batch size 等，避免爆显存；

- 核心依赖：Python3.11 + Torch2.4.0（cu121） + ms-swift3.12.6，所有依赖版本均经过测试，确保兼容无冲突。

## 二、具体环境配置步骤（全程复制指令即可）

### 步骤1：创建并激活Anaconda虚拟环境

先创建一个独立的虚拟环境（命名为llm），避免与其他项目的依赖冲突，指令如下（复制到终端执行）：

```zsh
# 创建虚拟环境，指定Python版本为3.11
conda create -n llm python=3.11 -y
# 激活创建好的虚拟环境
conda activate llm
```

⚠️ 踩坑提示：不要用Python3.10及以下版本，后续部分依赖（如ms-swift3.12.6）不兼容；也不要用3.12及以上，部分底层库尚未适配，3.11是最稳定的版本。

### 步骤2：安装Torch2.4.0+cu121（核心依赖）

Torch版本直接决定后续模型能否正常调用GPU，这里指定cu121版本（适配大多数显卡，包括V100和1660s），指令如下，直接复制执行，无需手动下载：

```zsh
pip install torch==2.4.0 torchvision==0.19.0 torchaudio==2.4.0 --index-url https://download.pytorch.org/whl/cu121
```

说明：--index-url 指定从PyTorch官方源下载，避免镜像源导致的版本缺失或安装失败，该源包含了cu121对应的所有依赖（如nvidia-cuda-runtime、nvidia-cudnn等），无需手动额外安装。

### 步骤3：手动安装ms-swift（微调核心工具）

ms-swift是我们微调Qwen-1_8B-Chat模型的核心工具，采用源码安装方式（确保版本为3.12.6，与后续依赖兼容），指令如下：

```zsh
# 克隆ms-swift源码（指定release/3.12分支，稳定版）
git clone -b release/3.12 https://github.com/modelscope/ms-swift.git
# 进入ms-swift目录
cd ms-swift
#  editable模式安装，后续修改源码也能实时生效
pip install -e '.[all]'
```

补充说明：ms-swift的源码地址为 [https://github.com/modelscope/ms-swift.git](https://github.com/modelscope/ms-swift.git)，如果克隆速度慢，可以替换为国内镜像源（如Gitee镜像），克隆后同样进入目录执行安装指令即可。

### 步骤4：通过yml文件补齐剩余依赖（关键一步）

这一步是避免依赖冲突的核心！我已经整理好所有需要的依赖，包含HuggingFace、LangChain、FastAPI等后续项目所需的所有工具，大家只需做两步：

1. 将下面的`llm_env.yml`文件内容复制到本地，保存为`llm_env.yml`（建议放在ms-swift目录同级，方便执行指令）；

2. 执行`conda env update -f llm_env.yml`，conda会自动检测已安装的依赖（如Torch、ms-swift），跳过重复安装，仅补齐缺失的依赖，避免报错。

```yml
name: llm
channels:
  - defaults
dependencies:
  - _libgcc_mutex=0.1=main
  - _openmp_mutex=5.1=1_gnu
  - bzip2=1.0.8=h5eee18b_6
  - ca-certificates=2026.3.19=h06a4308_0
  - ld_impl_linux-64=2.44=h9e0c5a2_3
  - libexpat=2.7.5=h7354ed3_0
  - libffi=3.4.4=h6a678d5_1
  - libgcc=15.2.0=h69a1729_7
  - libgcc-ng=15.2.0=h166f726_7
  - libgomp=15.2.0=h4751f2c_7
  - libnsl=2.0.0=h5eee18b_0
  - libstdcxx=15.2.0=h39759b7_7
  - libstdcxx-ng=15.2.0=hc03a8fd_7
  - libuuid=1.41.5=h5eee18b_0
  - libxcb=1.17.0=h9b100fa_0
  - libzlib=1.3.1=hb25bd0a_0
  - ncurses=6.5=h7934f7d_0
  - openssl=3.5.6=h1b28b03_0
  - packaging=26.0=py311h06a4308_0
  - pip=26.0.1=pyhc872135_1
  - pthread-stubs=0.3=h0ce48e5_1
  - python=3.11.15=h741d88c_0
  - readline=8.3=hc2a1206_0
  - setuptools=82.0.1=py311h06a4308_0
  - sqlite=3.51.2=h3e8d24a_0
  - tk=8.6.15=h54e0aa7_0
  - wheel=0.46.3=py311h06a4308_0
  - xorg-libx11=1.8.12=h9b100fa_1
  - xorg-libxau=1.0.12=h9b100fa_0
  - xorg-libxdmcp=1.1.5=h9b100fa_0
  - xorg-xorgproto=2024.1=h5eee18b_1
  - xz=5.8.2=h448239c_0
  - zlib=1.3.1=hb25bd0a_0
  - pip:
      - absl-py==2.4.0
      - accelerate==1.13.0
      - addict==2.4.0
      - aiofiles==24.1.0
      - aiohappyeyeballs==2.6.1
      - aiohttp==3.13.5
      - aiosignal==1.4.0
      - aliyun-python-sdk-core==2.16.0
      - aliyun-python-sdk-kms==2.16.5
      - annotated-doc==0.0.4
      - annotated-types==0.7.0
      - antlr4-python3-runtime==4.9.3
      - anyio==4.13.0
      - asttokens==3.0.1
      - attrdict==2.0.1
      - attrs==26.1.0
      - av==17.0.0
      - binpacking==2.0.1
      - brotli==1.2.0
      - certifi==2026.2.25
      - cffi==2.0.0
      - charset-normalizer==3.4.7
      - click==8.3.2
      - colorama==0.4.6
      - colorlog==6.10.1
      - contourpy==1.3.3
      - cpm-kernels==1.0.11
      - crcmod==1.7
      - cryptography==46.0.7
      - cycler==0.12.1
      - dacite==1.9.2
      - datasets==3.6.0
      - decorator==5.2.1
      - dill==0.3.8
      - distro==1.9.0
      - docstring-parser==0.18.0
      - dotenv==0.9.9
      - editdistance==0.8.1
      - einops==0.8.0
      - et-xmlfile==2.0.0
      - evalscope==1.6.0
      - evaluate==0.4.6
      - executing==2.2.1
      - fastapi==0.135.3
      - ffmpy==1.0.0
      - filelock==3.25.2
      - fire==0.7.1
      - fonttools==4.62.1
      - frozenlist==1.8.0
      - fsspec==2024.6.1
      - func-timeout==4.3.5
      - fuzzywuzzy==0.18.0
      - google-auth==2.49.2
      - google-genai==1.73.0
      - gradio==5.50.0
      - gradio-client==1.14.0
      - groovy==0.1.2
      - grpcio==1.80.0
      - h11==0.16.0
      - h5py==3.16.0
      - hf-xet==1.4.3
      - httpcore==1.0.9
      - httpx==0.28.1
      - huggingface-hub==0.36.2
      - human-eval==1.0.3
      - idna==3.11
      - imageio==2.37.3
      - immutabledict==4.3.1
      - importlib-metadata==9.0.0
      - ipdb==0.13.13
      - ipython==9.10.1
      - ipython-pygments-lexers==1.1.1
      - jedi==0.19.2
      - jieba==0.42.1
      - jinja2==3.1.6
      - jiter==0.14.0
      - jmespath==0.10.0
      - joblib==1.5.3
      - json-repair==0.59.3
      - json5==0.14.0
      - jsonlines==4.0.0
      - jsonschema==4.26.0
      - jsonschema-specifications==2025.9.1
      - kiwisolver==1.5.0
      - latex2sympy2-extended==1.11.0
      - levenshtein==0.27.3
      - lxml==6.0.4
      - markdown==3.10.2
      - markdown-it-py==4.0.0
      - markupsafe==3.0.3
      - math-verify==0.9.0
      - matplotlib==3.10.8
      - matplotlib-inline==0.2.1
      - mdurl==0.1.2
      - mmengine-lite==0.10.7
      - modelscope==1.34.0
      - more-itertools==11.0.2
      - mpmath==1.3.0
      - ms-opencompass==0.1.6
      - ms-swift==3.12.6
      - ms-vlmeval==0.0.19
      - msgpack==1.1.2
      - multidict==6.7.1
      - multiprocess==0.70.16
      - narwhals==2.19.0
      - networkx==3.6.1
      - nltk==3.9.4
      - numpy==1.26.4
      - nvidia-cublas-cu12==12.1.3.1
      - nvidia-cuda-cupti-cu12==12.1.105
      - nvidia-cuda-nvrtc-cu12==12.1.105
      - nvidia-cuda-runtime-cu12==12.1.105
      - nvidia-cudnn-cu12==9.1.0.70
      - nvidia-cufft-cu12==11.0.2.54
      - nvidia-curand-cu12==10.3.2.106
      - nvidia-cusolver-cu12==11.4.5.107
      - nvidia-cusparse-cu12==12.1.0.106
      - nvidia-ml-py==13.590.48
      - nvidia-nccl-cu12==2.20.5
      - nvidia-nvjitlink-cu12==12.9.86
      - nvidia-nvtx-cu12==12.1.105
      - nvitop==1.6.2
      - omegaconf==2.3.0
      - openai==2.31.0
      - opencc==1.2.0
      - opencv-python==4.11.0.86
      - openpyxl==3.1.5
      - orjson==3.11.8
      - oss2==2.19.1
      - overrides==7.7.0
      - pandas==2.3.3
      - parso==0.8.6
      - peft==0.18.1
      - pexpect==4.9.0
      - pillow==11.3.0
      - platformdirs==4.9.6
      - plotly==6.7.0
      - portalocker==3.2.0
      - prettytable==3.17.0
      - prompt-toolkit==3.0.52
      - propcache==0.4.1
      - protobuf==6.33.6
      - psutil==7.2.2
      - ptyprocess==0.7.0
      - pure-eval==0.2.3
      - pyarrow==23.0.1
      - pyasn1==0.6.3
      - pyasn1-modules==0.4.2
      - pycparser==3.0
      - pycryptodome==3.23.0
      - pydantic==2.12.3
      - pydantic-core==2.41.4
      - pydub==0.25.1
      - pyecharts==2.1.0
      - pygments==2.20.0
      - pylatexenc==2.10
      - pyparsing==3.3.2
      - pypinyin==0.55.0
      - python-dateutil==2.9.0.post0
      - python-dotenv==1.2.2
      - python-levenshtein==0.27.3
      - python-multipart==0.0.26
      - pytz==2026.1.post1
      - pyyaml==6.0.3
      - qwen-vl-utils==0.0.14
      - rank-bm25==0.2.2
      - rapidfuzz==3.14.5
      - ray==2.54.1
      - referencing==0.37.0
      - regex==2026.4.4
      - requests==2.33.1
      - rich==13.9.4
      - rouge==1.0.1
      - rouge-chinese==1.0.3
      - rouge-score==0.1.2
      - rpds-py==0.30.0
      - ruff==0.15.10
      - sacrebleu==2.6.0
      - safehttpx==0.1.7
      - safetensors==0.7.0
      - scikit-learn==1.8.0
      - scipy==1.17.1
      - seaborn==0.13.2
      - semantic-version==2.10.0
      - sentence-transformers==5.4.0
      - sentencepiece==0.2.0
      - shellingham==1.5.4
      - simplejson==3.20.2
      - six==1.17.0
      - sniffio==1.3.1
      - sortedcontainers==2.4.0
      - stack-data==0.6.3
      - starlette==0.52.1
      - sty==1.0.6
      - swanlab==0.7.15
      - sympy==1.14.0
      - tabulate==0.10.0
      - tenacity==9.1.4
      - tensorboard==2.20.0
      - tensorboard-data-server==0.7.2
      - termcolor==3.3.0
      - threadpoolctl==3.6.0
      - tiktoken==0.7.0
      - timeout-decorator==0.5.0
      - timm==1.0.26
      - tokenizers==0.22.2
      - tomlkit==0.13.3
      - torch==2.4.0+cu121
      - torchaudio==2.4.0+cu121
      - torchvision==0.19.0+cu121
      - tqdm==4.67.3
      - traitlets==5.14.3
      - transformers==4.57.6
      - transformers-stream-generator==0.0.5
      - triton==3.0.0
      - trl==0.24.0
      - typer==0.24.1
      - typing-extensions==4.15.0
      - typing-inspection==0.4.2
      - tzdata==2026.1
      - urllib3==2.6.3
      - uvicorn==0.44.0
      - validators==0.35.0
      - wcwidth==0.6.0
      - websockets==15.0.1
      - werkzeug==3.1.8
      - word2number==1.1
      - wrapt==2.1.2
      - xlsxwriter==3.2.9
      - xxhash==3.6.0
      - yapf==0.43.0
      - yarl==1.23.0
      - zhconv==1.4.3
      - zipp==3.23.1
      - zstandard==0.25.0
prefix: /home/lyz-ubuntu/anaconda3/envs/llm
```

⚠️ 踩坑提示：如果执行指令时出现“权限不足”，可以在指令前加`sudo`（服务器环境）；如果出现镜像源下载缓慢，可以在pip安装指令后加上清华镜像加速：`-i https://pypi.tuna.tsinghua.edu.cn/simple`。

### 步骤5：环境验证（确认安装成功）

所有依赖安装完成后，执行下面的验证指令，检查核心包是否正常加载、GPU是否可用（这一步必须做，避免后续微调时报错）：

```zsh
python -c "import sys; import torch; import swift; print('✅ Python 版本:', sys.version.split()[0]); print('✅ Torch 版本:', torch.__version__); print('✅ CUDA 可用:', torch.cuda.is_available()); print('✅ CUDA 版本:', torch.version.cuda if torch.cuda.is_available() else '无'); print('✅ ms-swift 正常'); print('\n🎉 所有核心包验证成功！')"
```

如果输出如下示例，说明环境配置成功，可以进入下一步模型微调；如果出现报错，对照报错信息检查对应依赖是否安装成功（多数报错是Torch或ms-swift安装失败，重新执行对应步骤即可）：

```zsh
✅ Python 版本: 3.11.15
✅ Torch 版本: 2.4.0+cu121
✅ CUDA 可用: True
✅ CUDA 版本: 12.1
✅ ms-swift 正常

🎉 所有核心包验证成功！
```

## 三、补充说明（新手必看）

- 1. 环境配置完成后，后续所有操作（数据集准备、模型微调等）都要在`llm`虚拟环境中执行，忘记激活环境会导致依赖找不到；

- 2. 本地1660s环境：目前环境配置已适配，但后续微调时，需要参考Swift文档中的显存控制参数（如int4量化、减小batch size），避免爆显存，后续教程会详细讲解；

- 3. 服务器V100环境：无需额外调整环境，后续微调可直接使用默认参数，性能充足，可快速完成微调；

- 4. 若需重新配置环境，可先删除原有虚拟环境：`conda remove -n llm --all`，再重新执行上述步骤即可。

好了，day02的环境配置就到这里～ 环境搭建是整个项目的基础，只要跟着步骤走，就能避免90%的坑！下一篇day03，我们将进行数据集准备与预处理，讲解3个核心医疗数据集的下载、清洗和格式转换，为后续模型微调做好准备。

如果大家在配置环境时遇到任何问题（比如依赖安装失败、CUDA报错、镜像源问题等），欢迎在评论区留言，我会及时回复并给出解决方案～ 关注我，后续持续更新「AI私人家庭医生」系列教程，一起从0到1做出实用的AI项目！