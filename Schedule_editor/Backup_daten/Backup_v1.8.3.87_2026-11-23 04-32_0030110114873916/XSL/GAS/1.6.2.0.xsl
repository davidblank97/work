<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/gas_info/gas[@name='ARGON']/conversion">
            <conversion>1</conversion>
	</xsl:template>
	
	<xsl:template match="/gas_info/gas[@name='HELIUM']/conversion">
	    <conversion>0.9909</conversion>
	</xsl:template>

	<xsl:template match="/gas_info/gas[@name='CARBON DIOXIDE']/conversion">
	    <conversion>1.925</conversion>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>