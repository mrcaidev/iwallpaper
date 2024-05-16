import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

# plot_data = {
#     "pure cosine": pd.DataFrame(
#         {
#             "Traditional": [
#                 1.1101899361262764,
#                 1.2018168588952216,
#                 1.3025581069099255,
#                 1.4443402069450495,
#                 1.630629393598493,
#             ],
#             "Optimized": [
#                 1.0743884036061278,
#                 1.1380719158448795,
#                 1.201998962956542,
#                 1.2886564873353814,
#                 1.4186391874406914,
#             ],
#         },
#         index=["0.9/0.1", "0.8/0.2", "0.7/0.3", "0.6/0.4", "0.5/0.5"],
#     ),
#     "correlation": pd.DataFrame(
#         {
#             "Traditional": [
#                 1.1566046353531563,
#                 1.2585603840790165,
#                 1.3810784582200735,
#                 1.5601672753915188,
#                 1.799258740082078,
#             ],
#             "Optimized": [
#                 1.0457066566661317,
#                 1.1062519285883328,
#                 1.1878801430762755,
#                 1.3122385981959752,
#                 1.5037959286102232,
#             ],
#         },
#         index=["0.9/0.1", "0.8/0.2", "0.7/0.3", "0.6/0.4", "0.5/0.5"],
#     ),
#     "adjusted cosine": pd.DataFrame(
#         {
#             "Traditional": [
#                 1.1094093891898946,
#                 1.1776154517822066,
#                 1.258152978619636,
#                 1.370200287848344,
#                 1.5319394197806,
#             ],
#             "Optimized": [
#                 1.0247907978657933,
#                 1.1016471240102852,
#                 1.159815521471251,
#                 1.2377997663827884,
#                 1.3461108698782553,
#             ],
#         },
#         index=["0.9/0.1", "0.8/0.2", "0.7/0.3", "0.6/0.4", "0.5/0.5"],
#     ),
# }

plot_data = {
    "pure cosine": pd.DataFrame(
        {
            "Traditional": [
                1.4353224341370883,
                1.2505655008169494,
                1.1586685923461855,
                1.0984572080781347,
                1.0542265603772605,
            ],
            "Optimized": [
                1.4990394984371114,
                1.2122544186895043,
                1.0771332771469349,
                1.0090649268156149,
                0.9598249059665159,
            ],
        },
        index=[20, 40, 60, 80, 100],
    ),
    "correlation": pd.DataFrame(
        {
            "Traditional": [
                1.531156860236157,
                1.3154548019260799,
                1.212687588944223,
                1.1434394060205546,
                1.091594131318186,
            ],
            "Optimized": [
                1.4711780850721006,
                1.180677548868082,
                1.0483837251842416,
                0.9837931083893847,
                0.9352309653705905,
            ],
        },
        index=[20, 40, 60, 80, 100],
    ),
    "adjusted cosine": pd.DataFrame(
        {
            "Traditional": [
                1.3925937247963704,
                1.221562674964022,
                1.1415293675538432,
                1.08873157241257,
                1.0554523028132174,
            ],
            "Optimized": [
                1.4497980552901584,
                1.173380053241768,
                1.0503624113636048,
                0.9722263533559043,
                0.9197621344192708,
            ],
        },
        index=[20, 40, 60, 80, 100],
    ),
}

fig, axes = plt.subplots(1, 3, sharey=True, figsize=(15, 6))

for measure_index, (measure, data) in enumerate(plot_data.items()):
    ax = axes[measure_index]
    sns.lineplot(data, markers=True, dashes=False, ax=ax)
    ax.set_title(f"Using {measure}")

fig.supxlabel("Neighborhood size")
fig.supylabel("MAE")
fig.suptitle("Sensitivity of neighborhood size")
fig.savefig("outputs/test_sensitivity_of_neighborhood_size.png")
