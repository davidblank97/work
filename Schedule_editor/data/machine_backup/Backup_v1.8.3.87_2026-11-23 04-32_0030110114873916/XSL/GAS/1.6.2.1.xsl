<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/gas_info/gas[@name='HELIUM']">
            <gas name="ARGON HELIUM MIX">
				<symbol>30Ar/70He</symbol>
				<conversion>0.9915</conversion>
			</gas>
	</xsl:template>
	<xsl:template match="/gas_info/gas[@name='CARBON DIOXIDE']">
			<gas name="ARGON HYDROGEN MIX">
				<symbol>95Ar/5H</symbol>
				<conversion>1.019</conversion>
			</gas>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>