<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/cal/axis/@timestamp" />

	<xsl:template match="/cal/axis/gain" >
		<gain timestamp="">
			<xsl:value-of select="."/>
		</gain>
	</xsl:template>
	<xsl:template match="/cal/axis/rev_gain" >
		<rev_gain timestamp="">
			<xsl:value-of select="."/>
		</rev_gain>
	</xsl:template>
	<xsl:template match="/cal/axis/pos_limit" >
		<pos_limit timestamp="">
			<xsl:value-of select="."/>
		</pos_limit>
	</xsl:template>
	<xsl:template match="/cal/axis/diameter" >
		<diameter timestamp="">
			<xsl:value-of select="."/>
		</diameter>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>