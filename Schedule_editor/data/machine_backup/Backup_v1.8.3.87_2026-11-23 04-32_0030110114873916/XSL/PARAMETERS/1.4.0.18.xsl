<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='265729']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'265030'"/>
		</xsl:attribute>
	</xsl:template>

	<xsl:template match="/Parameters/param[@id='265760']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'265031'"/>
		</xsl:attribute>
	</xsl:template>

	<xsl:template match="/Parameters/param[@id='265761']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'265033'"/>
		</xsl:attribute>
	</xsl:template>

	<xsl:template match="/Parameters/param[@id='265762']/@id">
		<xsl:attribute name="id">
			<xsl:value-of select="'265032'"/>
		</xsl:attribute>
	</xsl:template>
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>