<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='265018']/short_name">
		<short_name>SHIELD GAS</short_name>
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='265019']/short_name">
		<short_name>TRAIL GAS</short_name>
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='265020']/short_name">
		<short_name>PLASMA GAS</short_name>
	</xsl:template>

	<xsl:template match="/Parameters/param[@id='265021']/short_name">
		<short_name>BACKUP GAS</short_name>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>