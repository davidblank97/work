<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output  omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='CON']/str[@id='1']">
		<str id="1">
			<text>Could not establish a connection to the %1 server. Check the connection to the network and try again.</text>
			<desc>%1 = Name of the server.</desc>
		</str>
	</xsl:template>

	<xsl:template match="/language[@fileType='CON']/str[@id='2']">
		<str id="2">
			<text>An error occurred while updating to %1. Reason: |%2</text>
			<desc>%1 = name of the update package</desc>
		</str>
	</xsl:template>

	<xsl:template match="/language[@fileType='CON']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="9">
				<text>An error occured while downloading the files from the %1 server. Check the connection to the network and try again.</text>
				<desc>%1 = Name of the server.</desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>