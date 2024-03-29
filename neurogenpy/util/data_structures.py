"""
Data structures utilities module.
"""

# Computational Intelligence Group (CIG). Universidad Politécnica de Madrid.
# http://cig.fi.upm.es/

# Licensed under GNU General Public License v3.0:
# https://www.gnu.org/licenses/gpl-3.0.html

import logging

import networkx as nx
import numpy as np
from igraph import Graph
from pgmpy.models import BayesianNetwork as PGMPY_BN
from rpy2.robjects import pandas2ri, default_converter, conversion
from rpy2.robjects.conversion import localconverter

logger = logging.getLogger(__name__)


def get_data_type(df):
    """
    Retrieves the data type of the full data set which types are provided.

    Parameters
    ----------
    df : pandas.DataFrame
        Data set to be checked.

    Returns
    -------
    {'continuous', 'discrete'}
        The type of the data set

    Raises
    ------
    ValueError
        If the data is hybrid.
    """

    is_number = np.vectorize(lambda x: np.issubdtype(x, np.number))
    if all(is_number(df.dtypes)):
        return 'continuous'
    elif (not any(is_number(df.dtypes))) and (
            any(df.dtypes == 'object') or any(df.dtypes == 'bool')):
        return 'discrete'
    else:
        raise Exception("Only continuous or discrete data sets are accepted.")


def pd2r(df):
    """
    Converts a pandas DataFrame into an R dataframe.

    Parameters
    ----------
    df : pandas.DataFrame
        Data set to be transformed.

    Returns
    -------
        R dataframe with the same information as the input dataframe.
    """

    with localconverter(default_converter + pandas2ri.converter):
        r_from_pd_df = conversion.py2rpy(df)

    return r_from_pd_df


def matrix2nx(graph, nodes):
    """
    Converts an adjacency matrix into a networkx graph.

    Parameters
    ----------
    graph : numpy.array
        Adjacency matrix of the graph.

    nodes : list
        IDs of the nodes in the adjacency matrix.

    Returns
    -------
    networkx.DiGraph
        A graph representing the network determined by the adjacency matrix.
    """

    mapping = {i: node for i, node in enumerate(nodes)}
    nx_graph = nx.from_numpy_matrix(graph, create_using=nx.DiGraph())
    nx_graph = nx.relabel_nodes(nx_graph, mapping)
    return nx_graph


def nx2pgmpy(graph, parameters):
    """
    Converts a networkx graph and some distribution parameters into a pgmpy
    Bayesian network.

    Parameters
    ----------
    graph : networkx.DiGraph

    parameters : dict

    Returns
    -------
    pgmpy.BayesianNetwork
    """

    pgmpy_model = PGMPY_BN(graph)
    # pgmpy_model.add_nodes_from(graph.nodes())
    # pgmpy_model.add_edges_from(graph.edges())
    if parameters:
        pgmpy_model.add_cpds(*parameters)

    return pgmpy_model


def pgmpy2nx(bn):
    """
    Converts a pgmpy Bayesian Network into an adjacency matrix and distribution
    parameters.

    Parameters
    ----------
    bn : pgmpy.BayesianNetwork

    Returns
    -------
    (networkx.DiGraph, dict)
    """

    graph = nx.DiGraph()
    graph.add_nodes_from(bn.nodes())
    graph.add_edges_from(bn.edges())
    parameters = bn.get_cpds()

    return graph, parameters


def nx2igraph(graph):
    """
    Converts a NetworkX DiGraph into an iGraph graph.

    Parameters
    ----------
    graph : networkx.DiGraph
        The NetworkX DiGraph to convert.

    Returns
    -------
    igraph.Graph
        The equivalent iGraph graph.
    """

    result = Graph(directed=True)
    nodes = list(graph.nodes())
    edges = list(graph.edges())
    result.add_vertices(nodes)
    result.add_edges(edges)

    return result


def bnlearn2nx(nodes, r_output):
    """
    Converts R's bnlearn output into a NetworkX graph.

    Parameters
    ----------
    nodes: list
        Nodes that form the network.

    r_output:
        R's bnlearn output.

    Returns
    -------
    networkx.DiGraph
        A graph representing the network.
    """

    logger.info(f'bnlearn output: {r_output}')
    arcs_r = r_output.rx2('arcs')

    graph = nx.DiGraph()
    graph.add_nodes_from(nodes)
    if len(arcs_r) > 0:
        edges_from = np.array(arcs_r.rx(True, 1))
        edges_to = np.array(arcs_r.rx(True, 2))
        edges = zip(edges_from, edges_to)
        graph.add_edges_from(edges)
    return graph
